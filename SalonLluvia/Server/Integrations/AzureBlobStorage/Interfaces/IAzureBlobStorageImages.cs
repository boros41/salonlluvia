using Azure;
using Azure.Storage.Blobs.Models;

namespace Server.Integrations.AzureBlobStorage.Interfaces;

public interface IAzureBlobStorageImages
{
    Task<Dictionary<string, string>> GetImageUrlsAsync();
    Task<Response<BlobContentInfo>> PostImageAsync(string filename, IFormFile file);
}