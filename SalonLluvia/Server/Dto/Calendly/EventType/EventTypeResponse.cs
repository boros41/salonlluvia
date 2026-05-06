using System.Text.Json.Serialization;

namespace Server.Dto.Calendly.EventType;

internal sealed record EventTypeResponse
{
    [JsonPropertyName("collection")]
    public required List<EventTypeUri> Collection { get; init; }
}

internal sealed record EventTypeUri
{
    [JsonPropertyName("uri")]
    public required string Uri { get; init; }
}