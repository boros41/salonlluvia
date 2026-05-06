namespace Server.Integrations.Calendly;

public interface ICalendlyUser
{
    Task<string> GetUserUri(); // https://developer.calendly.com/api-docs/ff9832c5a6640-get-user
    Task<string> GetUserEventTypeUri(string userUri); // https://developer.calendly.com/api-docs/25a4ece03c1bc-list-user-s-event-types
}