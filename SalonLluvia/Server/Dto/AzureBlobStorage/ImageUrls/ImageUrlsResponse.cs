using System.Text.Json.Serialization;

namespace Server.Dto.AzureBlobStorage.ImageUrls;

internal sealed record ImageUrlsResponse
{
    [JsonPropertyName("images")]
    public required List<ImageResponse> Images { get; init; }
}

internal sealed record ImageResponse
{
    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("url")]
    public required string Url { get; init; }

    [JsonPropertyName("description")]
    public required string Description { get; init; }

    [JsonPropertyName("hairstyles")]
    public required List<HairStyleResponse> Hairstyles { get; init; }

    [JsonPropertyName("hairColors")]
    public required List<HairColorResponse> HairColors { get; init; }
}

internal sealed record HairStyleResponse
{
    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("style")]
    public required string Style { get; init; }
}

internal sealed record HairColorResponse
{
    [JsonPropertyName("id")]
    public required int Id { get; init; }

    [JsonPropertyName("color")]
    public required string Color { get; init; }
}