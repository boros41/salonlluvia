using Server.Dto.Calendly.AvailableTimes;
using System.Text.Json;

namespace Server.Integrations.Calendly;

public sealed class CalendlyAvailableDays : CalendlyClient, ICalendlyAvailableDays
{
    public CalendlyAvailableDays(IConfiguration config) : base(config) { }

    public async Task<HashSet<string>> GetAvailableDays()
    {
        string userUri = await GetUserUri();
        string eventTypeUri = await GetUserEventTypeUri(userUri);

        // Will not contain weekends nor any day that already has at least one appointment. Calendly account is configured that way.
        HashSet<string> availableDays = [];

        DateTime start = DateTime.UtcNow.AddDays(1);
        DateTime end = start.AddDays(7);

        await FillDays(start, end);

        return availableDays;

        async Task FillDays(DateTime startDate, DateTime endDate)
        {
            if (startDate > endDate)
            {
                throw new ArgumentException($"Start date \"{startDate}\" must be before end date \"{endDate}\"");
            }

            TimeSpan duration = endDate - startDate;

            if (duration.Days != 7)
            {
                throw new ArgumentException($"Date range can be no greater than 1 week (7 days). \"{endDate}\" - \"{startDate}\" == {duration.Days}");
            }

            DateTime today = DateTime.UtcNow;
            TimeSpan twoMonths = startDate - today;

            // BASE CASE: Can only book up to two months in advance. Really, 9 weeks: 7 * 9 = 63 days
            if (twoMonths.Days >= 60)
            {
                return;
            }

            string startTime = startDate.ToString("O");
            string endTime = endDate.ToString("O");

            string requestUri = $"https://api.calendly.com/event_type_available_times?event_type={Uri.EscapeDataString(eventTypeUri)}&start_time={Uri.EscapeDataString(startTime)}&end_time={Uri.EscapeDataString(endTime)}";

            var client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(requestUri),
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

            AvailableTimesResponse availableTimesResponse = JsonSerializer.Deserialize<AvailableTimesResponse>(body) ??
                                                            throw new JsonException("Failed to deserialize Calendly event type available times.");

            foreach (AvailableTime availableTime in availableTimesResponse.Collection)
            {
                // Since a day is considered available if it has 0 bookings, we don't care about the time part, hence the hashset for no duplicates
                const string dateFormat = "yyyy-MM-dd";
                availableDays.Add(availableTime.StartTime.ToString(dateFormat));
            }

            // Recursive step towards base case, Calendly API only allows date ranges of 1 week at a time
            await FillDays(startDate: endDate, endDate: endDate.AddDays(7));
        }
    }
}