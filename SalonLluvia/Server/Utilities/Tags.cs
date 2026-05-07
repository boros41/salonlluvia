namespace Server.Utilities;

public static class Tags
{
    public const string BusinessName = "salonlluvia";
    public const string BusinessPhone = "(704) 500-3937";
    public const int SHA256HashHexLength = 64;
    public const string ImagePurpose = "gallery";
    public const string ImageVariant = "original"; // og image uploaded or processed .webp image, etc
    public const int GalleryImageNameLength = 93; // {imageHash}-{Tags.BusinessName}-{purpose}-{variant}
    public const string GalleryImagesCacheKey = "gallery-image-urls";
    public const string AvailableDaysCacheKey = "available-days";
}
