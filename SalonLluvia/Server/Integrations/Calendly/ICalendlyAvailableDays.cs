namespace Server.Integrations.Calendly;

public interface ICalendlyAvailableDays
{
    Task<HashSet<string>> GetAvailableDays(); // https://developer.calendly.com/api-docs/6a1be82aef359-list-event-type-available-times
}