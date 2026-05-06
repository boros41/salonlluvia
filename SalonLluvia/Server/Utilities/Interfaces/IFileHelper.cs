using System.Security.Cryptography;

namespace Server.Utilities.Interfaces;

public interface IFileHelper
{
    public async Task<byte[]> GetBytesAsync(IFormFile file)
    {
        using MemoryStream memoryStream = new MemoryStream();
        await file.CopyToAsync(memoryStream);

        return memoryStream.ToArray();
    }

    public async Task<string> GetFileHashCodeAsync(IFormFile file)
    {
        await using Stream fileStream = file.OpenReadStream();
        byte[] fileHashData = await SHA256.HashDataAsync(fileStream);

        return Convert.ToHexString(fileHashData).ToLower();
    }
}