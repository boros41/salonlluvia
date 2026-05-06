using System.Text.Json.Serialization;

namespace Server.Dto.Calendly.AvailableTimes;

internal sealed record AvailableTimesResponse
{
    [JsonPropertyName("collection")]
    public required List<AvailableTime> Collection { get; init; }
}

internal sealed record AvailableTime
{
    [JsonPropertyName("invitees_remaining")]
    public required int InviteesRemaining { get; init; }

    [JsonPropertyName("scheduling_url")]
    public required string SchedulingUrl { get; init; }

    [JsonPropertyName("start_time")]
    public required DateTime StartTime { get; init; }

    [JsonPropertyName("status")]
    public required string Status { get; init; }
}