using Server.Dto.Calendly.EventType;
using Server.Dto.Calendly.User;
using System.Text.Json;

namespace Server.Integrations.Calendly;

// Abstract because we need an API token retrieved from user-secrets via DI.
// Also, GetUserUri() & GetUserEventTypeUri() would be the same code for retrieving available days & creating appointments. 
public abstract class CalendlyClient : ICalendlyUser
{
    protected readonly string Token;

    protected CalendlyClient(IConfiguration config)
    {
        Token = config["Calendly:PAT"] ?? throw new InvalidOperationException("Missing Calendly:PAT secret");
    }

    public async Task<string> GetUserUri()
    {
        HttpClient client = new HttpClient();
        HttpRequestMessage request = new HttpRequestMessage()
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri("https://api.calendly.com/users/me"),
            Headers =
            {
                {
                    "Authorization",
                    "Bearer " + Token
                },
            },
        };

        using HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string body = await response.Content.ReadAsStringAsync();

        UserResponse userResponse = JsonSerializer.Deserialize<UserResponse>(body) ?? throw new JsonException("Failed to deserialize Calendly user.");

        return userResponse.Resource.Uri;
    }

    public async Task<string> GetUserEventTypeUri(string userUri)
    {
        var client = new HttpClient();
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Get,
            RequestUri = new Uri("https://api.calendly.com/event_types?user=" + Uri.EscapeDataString(userUri)),
            Headers =
            {
                {
                    "Authorization",
                    "Bearer " + Token
                },
            },
        };
        using HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        string body = await response.Content.ReadAsStringAsync();

        EventTypeResponse eventTypeResponse = JsonSerializer.Deserialize<EventTypeResponse>(body) ??
                                      throw new JsonException("Failed to deserialize Calendly user's event types.");

        // Calendly account is configured to have only one event type
        return eventTypeResponse.Collection[0].Uri;
    }
}