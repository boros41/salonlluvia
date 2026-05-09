using System.Text.Json.Serialization;

namespace Server.Dto.Account;

public record CurrentUserResponse
{
    [JsonPropertyName("username")]
    public string? Username { get; init; } = string.Empty;

    [JsonPropertyName("email")]
    public string? Email { get; init; } = string.Empty;

    [JsonPropertyName("roles")]
    public List<string> Roles { get; init; } = [];

    [JsonPropertyName("isAdmin")]
    public bool IsAdmin { get; init; } = false;

    [JsonPropertyName("isLoggedIn")]
    public bool IsLoggedIn { get; init; } = false;
}
