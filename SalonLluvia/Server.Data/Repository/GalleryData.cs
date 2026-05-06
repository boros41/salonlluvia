namespace Server.Data.Repository;

public sealed class GalleryData<TImage, THairProfile, THairStyle, THairColor>
    where TImage : class
    where THairProfile : class
    where THairStyle : class
    where THairColor : class
{
    public IRepository<TImage> ImageRepo { get; }
    public IRepository<THairProfile> HairProfileRepo { get; }
    public IRepository<THairStyle> HairstyleRepo { get; }
    public IRepository<THairColor> HairColorRepo { get; }

    public GalleryData(IRepository<TImage> imageRepo, IRepository<THairProfile> hairProfileRepo,
        IRepository<THairStyle> hairstyleRepo, IRepository<THairColor> hairColorRepo)
    {
        ImageRepo = imageRepo;
        HairProfileRepo = hairProfileRepo;
        HairstyleRepo = hairstyleRepo;
        HairColorRepo = hairColorRepo;
    }
}