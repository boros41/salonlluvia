using System.Text.Json.Serialization;

namespace Server.Dto.Calendly.CreateAppointment;

// https://developer.calendly.com/api-docs/p3ghrxrwbl8kqe-create-event-invitee
internal sealed record CreateAppointmentRequest
{
    [JsonPropertyName("event_type")]
    public required string EventTypeUri { get; init; }
    [JsonPropertyName("start_time")]
    public required DateTime StartTime { get; init; }
    [JsonPropertyName("invitee")]
    public required Invitee Invitee { get; init; }

    [JsonPropertyName("location")]
    public Location Location { get; } = new Location();
    [JsonPropertyName("questions_and_answers")]
    public required List<QuestionsAndAnswers> QuestionsAndAnswers { get; init; }
}

internal sealed record Invitee
{
    [JsonPropertyName("name")]
    public required string Name { get; init; }
    [JsonPropertyName("email")]
    public required string Email { get; init; }
    [JsonPropertyName("timezone")]
    public string TimeZone { get; } = "EST";
}

internal sealed record Location
{
    [JsonPropertyName("kind")]
    public string Kind { get; } = "physical";
    [JsonPropertyName("location")]
    public string Address { get; } = "1419 Salisbury Rd, Statesville, NC 28625";
}

internal sealed record QuestionsAndAnswers
{
    [JsonPropertyName("question")]
    public required string Question { get; init; }
    [JsonPropertyName("answer")]
    public required string Answer { get; init; }
    [JsonPropertyName("position")]
    public required int Position { get; init; }
}