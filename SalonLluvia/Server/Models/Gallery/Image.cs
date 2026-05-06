using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Server.Utilities;
using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery;

public class Image
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Please enter an image name.")]
    [StringLength(Tags.GalleryImageNameLength, ErrorMessage = "Filepath must be 260 characters or less.")]
    public string Name { get; set; } = string.Empty; // {imageHash}-{Tags.BusinessName}-{purpose}-{variant} 

    [Required(ErrorMessage = "Please enter a hair style.")]
    public int? HairProfileId { get; set; } // foreign key linking to HairProfile

    // one-to-many: One hair profile can have many images (multiple photos of the same person's hair), but one image can have only one hair profile.
    // well, the above is true if I implement multiple image uploads at once, which I have not
    [ValidateNever]
    public HairProfile HairProfile { get; set; } = null!;

    [StringLength(50, ErrorMessage = "Description must be 50 characters or less.")]
    public string? Description { get; set; }
}