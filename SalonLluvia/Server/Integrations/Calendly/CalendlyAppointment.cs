using Server.Dto.Calendly.CreateAppointment;
using Server.Models.ViewModels;
using System.Net.Http.Headers;
using System.Text.Json;

namespace Server.Integrations.Calendly;

public sealed class CalendlyAppointment : CalendlyClient, ICalendlyAppointment
{
    public CalendlyAppointment(IConfiguration config) : base(config) { }

    public async Task CreateAppointment(AppointmentViewModel model)
    {
        string jsonContent = await GetJsonContent(model);

        var client = new HttpClient();
        var request = new HttpRequestMessage
        {
            Method = HttpMethod.Post,
            RequestUri = new Uri("https://api.calendly.com/invitees"),
            Headers =
            {
                {
                    "Authorization",
                    "Bearer " + Token
                }
            },
            Content = new StringContent(jsonContent)
            {
                Headers =
                {
                    ContentType = new MediaTypeHeaderValue("application/json")
                }
            }
        };
        using HttpResponseMessage response = await client.SendAsync(request);
        response.EnsureSuccessStatusCode();
        //string body = await response.Content.ReadAsStringAsync();
    }

    private async Task<string> GetJsonContent(AppointmentViewModel model)
    {
        DateTime date = (DateTime)model.Date!; // model.Date has a [Required] attribute which requires a nullable for value types
        CreateAppointmentRequest appointmentRequest = new CreateAppointmentRequest
        {
            EventTypeUri = await GetUserEventTypeUri(await GetUserUri()),
            StartTime = new DateTime(date.Year, date.Month, date.Day, 16, 0, 0, DateTimeKind.Utc), // hour is within Calendly user's working hours
            Invitee = new Invitee { Name = model.Name, Email = model.Email },
            QuestionsAndAnswers = new List<QuestionsAndAnswers>()
            {
                {new QuestionsAndAnswers() {Question = "Teléfono", Answer = model.PhoneNumber, Position = 0}},
                {new QuestionsAndAnswers()
                {
                    Question = "Cuéntenos algo que nos ayude a prepararnos para la reunión.", Answer = model.DesiredService, Position = 1
                }}
            }
        };

        return JsonSerializer.Serialize(appointmentRequest);
    }
}