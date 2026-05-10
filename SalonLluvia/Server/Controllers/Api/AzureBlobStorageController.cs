using Azure;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Server.Data.Repository;
using Server.Dto.AzureBlobStorage.ImageUrls;
using Server.Dto.Gallery;
using Server.Integrations.AzureBlobStorage.Interfaces;
using Server.Models.Gallery;
using Server.Models.Gallery.ViewModels;
using Server.Utilities;
using Server.Utilities.Interfaces;

namespace Server.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class AzureBlobStorageController : ControllerBase
{
    private readonly IAzureBlobStorageImages _blobStorageImages;
    private readonly IMemoryCache _memoryCache;
    private readonly IRepository<Image> _imageRepo;
    private readonly GalleryData<Image, HairProfile, HairStyle, HairColor> _galleryData;

    public AzureBlobStorageController(IAzureBlobStorageImages blobStorageImages, IMemoryCache memoryCache, IRepository<Image> imageRepo,
        GalleryData<Image, HairProfile, HairStyle, HairColor> galleryData)
    {
        _blobStorageImages = blobStorageImages;
        _memoryCache = memoryCache;
        _imageRepo = imageRepo;
        _galleryData = galleryData;
    }

    [HttpGet("image-url")]
    public async Task<IActionResult> Get([FromQuery] FilterOptionsRequest filters)
    {
        try
        {
            Dictionary<string, string> imageUrlByName = await _memoryCache.GetOrCreateAsync(Tags.GalleryImagesCacheKey, cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromDays(1);

                return _blobStorageImages.GetImageUrlsAsync();
            }) ?? throw new InvalidOperationException($"Value for memory cache \"{Tags.GalleryImagesCacheKey}\" was null");

            List<ImageResponse> imagesResponse = [];
            foreach ((string imageNameInAzure, string imageUrl) in imageUrlByName)
            {
                QueryOptions<Image> queryOptions = new QueryOptions<Image>()
                {
                    Includes = "HairProfile",
                    ThenIncludes = "HairStyles, HairColors",
                    FilterHairstyles = filters.Hairstyles,
                    FilterHairColors = filters.HairColors,
                };

                // gender filters ( (gender) && (hairstyle1 OR hairstyle2...) && (hairColor1 OR hairColor2...) )
                if (!filters.Gender.Equals("both", StringComparison.CurrentCultureIgnoreCase))
                {
                    if (!IsValidGenderFilter(filters.Gender))
                    {
                        throw new RequestFailedException("Invalid gender filter specified.");
                    }

                    // Database uses "F" & "M" and also unable to use string.Equals() with a comparator with EF Core
                    string filterGender = filters.Gender.ToUpper();
                    queryOptions.GenderFilter = image => image.HairProfile.Gender == filterGender;
                }

                // hairstyle filters ( (gender) && (hairstyle1 OR hairstyle2...) && (hairColor1 OR hairColor2...) )
                // include images where their associated hairstyle is contained within the selected hairstyles passed in from the query parameters
                queryOptions.HairstylePredicate = imageInQuerySet => imageInQuerySet.HairProfile.HairStyles.Any(hairstyleInQuerySet => queryOptions.FilterHairstyles.Contains(hairstyleInQuerySet.Style));

                // hair color filters ( (gender) && (hairstyle1 OR hairstyle2...) && (hairColor1 OR hairColor2...) )
                // include images where their associated hair color is contained within the selected hair colors passed in from the query parameters
                queryOptions.HairColorPredicate = colorInQuerySet => colorInQuerySet.HairProfile.HairColors.Any(haircolorInQuerySet => queryOptions.FilterHairColors.Contains(haircolorInQuerySet.Color));

                // name has the image's hash code so it will be unique to safely query
                IEnumerable<Image> imagesInDb = _imageRepo.List(queryOptions).ToList();

                IEnumerable<string> imageNamesInDb = imagesInDb.Select(image => image.Name);

                // since imageNameInAzure came from Azure Blob Storage, it may not be stored in the DB if uploaded through Azure & not the web app
                if (!imageNamesInDb.Contains(imageNameInAzure))
                {
                    // this will always enter if there are 0 images in the DB even if some are in Azure Blob Storage
                    continue;
                }

                Image imageInDb = imagesInDb.First(image => image.Name == imageNameInAzure);

                string imageDescription = imageInDb.Description ?? string.Empty; // null if there was no description set when uploaded

                List<HairStyleResponse> hairStyles = imageInDb.HairProfile
                                                          .HairStyles
                                                          .Select(hairstyle => new HairStyleResponse() { Id = hairstyle.Id, Style = hairstyle.Style })
                                                          .ToList();

                List<HairColorResponse> hairColors = imageInDb.HairProfile
                                                          .HairColors
                                                          .Select(hairColor => new HairColorResponse() { Id = hairColor.Id, Color = hairColor.Color })
                                                          .ToList();

                ImageResponse imageResponse = new ImageResponse()
                {
                    Id = imageInDb.Id,
                    Url = imageUrl,
                    Description = imageDescription,
                    Hairstyles = hairStyles,
                    HairColors = hairColors
                };

                imagesResponse.Add(imageResponse);
            }

            if (imagesResponse.Count == 0)
            {
                return StatusCode(StatusCodes.Status204NoContent);
            }

            ImageUrlsResponse response = new ImageUrlsResponse() { Images = imagesResponse };

            return new JsonResult(response);
        }
        catch (RequestFailedException e)
        {
            return StatusCode(e.Status);
        }
        catch (AggregateException e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (InvalidOperationException e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpGet]
    [Route("filters")]
    public async Task<IActionResult> Filters()
    {
        IEnumerable<HairStyle> hairstyles = _galleryData.HairstyleRepo.List(new QueryOptions<HairStyle>());
        IEnumerable<HairColor> hairColors = _galleryData.HairColorRepo.List(new QueryOptions<HairColor>());

        return Ok(new { hairstyles = hairstyles, hairColors = hairColors });
    }

    [HttpPost]
    [Route("upload")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Gallery(ImageViewModel model, [FromServices] IImageHelper imageHelper, [FromServices] IAzureBlobStorageImages azureBlobStorageImages)
    {
        HashSet<string> acceptedMediaType = ["image/jpeg", "image/png", "image/webp"];

        bool isMediaTypeAccepted = acceptedMediaType.Contains(model.Image.ContentType);

        if (!isMediaTypeAccepted)
        {
            const string detail = "Please upload a \".jpg\", \".png\", or \".webp\" image.";
            return Problem(detail, statusCode: StatusCodes.Status415UnsupportedMediaType);
        }

        string imageHash = await imageHelper.GetFileHashCodeAsync(model.Image);

        // hash first so we can easily search the image in Azure Blob Storage only by this prefix
        string imageName = $"{imageHash}-{Tags.BusinessName}-{Tags.ImagePurpose}-{Tags.ImageVariant}";

        Response<BlobContentInfo> response;

        try
        {
            response = await azureBlobStorageImages.PostImageAsync(imageName, model.Image);

            _memoryCache.Remove(Tags.GalleryImagesCacheKey); // refresh cache after uploading image so it shows after redirect
        }
        catch (RequestFailedException e)
        {
            if (e.Status != StatusCodes.Status409Conflict)
            {
                return StatusCode(StatusCodes.Status409Conflict);
            }

            if (IsImageInDatabase(imageName))
            {
                const string detail = "The specified image already exists in Azure Blob Storage and the database.";
                return StatusCode(StatusCodes.Status409Conflict, new { detail });
            }
            else
            {
                const string detail = "The specified image already exists in Azure Blob Storage, but not the database. Now saved to both.";
                UploadImage(model, imageName);

                return Ok(new { detail });
            }
        }

        UploadImage(model, imageName);

        return Ok();
    }

    [NonAction]
    private static bool IsValidGenderFilter(string gender)
    {
        string[] genders = ["F", "M"];

        return genders.Contains(gender, StringComparer.OrdinalIgnoreCase);
    }

    [NonAction]
    private bool IsImageInDatabase(string name)
    {
        return _galleryData.ImageRepo
                           .List(new QueryOptions<Image>())
                           .FirstOrDefault(image => image.Name == name) is not null;
    }

    [NonAction]
    private void UploadImage(ImageViewModel model, string imageName)
    {
        HairProfile hairProfile = new HairProfile() { Gender = model.Gender };

        List<string> selectedHairstyles = model.HairStyles
                                               //.Where(hairstyleVm => hairstyleVm.IsChecked)
                                               .Select(hairstyleVm => hairstyleVm.Style)
                                               .ToList();

        List<string> selectedHairColors = model.HairColors
                                               //.Where(hairColorVm => hairColorVm.IsChecked)
                                               .Select(hairColorVm => hairColorVm.Color)
                                               .ToList();

        // This is the skip navigation property in HairProfile so adding these hairstyles from the DB should populate the HairProfileHairStyle junction table
        // E.g., if 3 hairstyles were selected, EF Core will add an entry to the HairProfile table and 3 new junction table entries linking that HairProfile.Id to those 3 HairStyle.Ids
        List<HairStyle> existingHairStyles = _galleryData.HairstyleRepo
                                                         .List(new QueryOptions<HairStyle>()
                                                         {
                                                             Where = hairstyle => selectedHairstyles.Contains(hairstyle.Style)
                                                         })
                                                         .ToList();

        // This is the skip navigation property in HairProfile so adding these hair colors from the DB should populate the HairProfileHairColor junction table
        // E.g., if 3 hair colors were selected, EF Core will add an entry to the HairProfile table and 3 new junction table entries linking that HairProfile.Id to those 3 HairColor.Ids
        List<HairColor> existingHairColors = _galleryData.HairColorRepo
                                                         .List(new QueryOptions<HairColor>()
                                                         {
                                                             Where = hairColor => selectedHairColors.Contains(hairColor.Color)
                                                         })
                                                         .ToList();

        hairProfile.HairStyles.AddRange(existingHairStyles);
        hairProfile.HairColors.AddRange(existingHairColors);

        Image uploadedImage = new Image()
        {
            Name = imageName,
            Description = model.Description,
            HairProfile = hairProfile
        };

        if (IsImageInDatabase(imageName))
        {
            const string message = "Image was already uploaded to the database, but did not exist in Azure. Now saved to both.";

            return;
        }

        _galleryData.ImageRepo.Insert(uploadedImage);
        _galleryData.ImageRepo.Save();
    }
}