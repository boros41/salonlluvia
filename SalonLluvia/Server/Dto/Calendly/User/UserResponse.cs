using System.Text.Json.Serialization;

namespace Server.Dto.Calendly.User;

internal sealed record UserResponse
{
    [JsonPropertyName("resource")]
    public required UserResource Resource { get; init; }
}

internal sealed record UserResource
{
    [JsonPropertyName("uri")]
    public required string Uri { get; init; }
}