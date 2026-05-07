using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Server.Data.Repository;
using Server.Integrations.Calendly;
using Server.Models;
using Server.Models.ViewModels;
using Server.Utilities;
using System.Text.Json;

namespace Server.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class CalendlyController : ControllerBase
{
    private readonly ICalendlyAvailableDays _availableDays;
    private readonly IMemoryCache _memoryCache;
    private readonly IRepository<Client> _clientRepo;
    private readonly ICalendlyAppointment _calendlyAppointment;
    private readonly IRepository<Appointment> _appointmentRepo;

    public CalendlyController(ICalendlyAvailableDays availableDays, IMemoryCache memoryCache,
        IRepository<Client> clientRepo, ICalendlyAppointment appointment, IRepository<Appointment> appointmentRepo)
    {
        _availableDays = availableDays;
        _memoryCache = memoryCache;
        _clientRepo = clientRepo;
        _calendlyAppointment = appointment;
        _appointmentRepo = appointmentRepo;
    }

    [HttpGet("available-days")]
    public async Task<IActionResult> Get()
    {
        StringValues authorization = Request.Headers.Authorization;

        try
        {
            HashSet<string> availableDays = await _memoryCache.GetOrCreateAsync(Tags.AvailableDaysCacheKey, cacheEntry =>
            {
                cacheEntry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5);

                return _availableDays.GetAvailableDays();
            }) ?? new HashSet<string>(0); // no available days returned from Calendly

            return Ok(availableDays);
        }
        catch (HttpRequestException e)
        {
            if (e.StatusCode is null)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
            }

            int statusCode = (int)e.StatusCode.Value;
            return StatusCode(statusCode);
        }
        catch (JsonException e)
        {
            return StatusCode(StatusCodes.Status502BadGateway);
        }
        catch (InvalidOperationException e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status500InternalServerError);
        }
    }

    [HttpPost("appointment")]
    [Consumes("application/json")]
    public async Task<IActionResult> Post(AppointmentViewModel model)
    {
        if (_memoryCache.TryGetValue(Tags.AvailableDaysCacheKey, out HashSet<string>? availableDays))
        {
            if (availableDays == null || availableDays.Count == 0)
            {
                const string detail = $"There are no available days took book an appointment for. Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}";
                string instance = Request.Path.ToString();
                const string title = "No available days to book.";

                // https://www.rfc-editor.org/rfc/rfc9457#name-members-of-a-problem-detail
                return Problem(detail, instance, StatusCodes.Status409Conflict, title);
            }

            DateTime date = (DateTime)model.Date!; // model.Date has a [Required] attribute which requires a nullable for value types
            if (!availableDays.Contains(date.ToString("yyyy-MM-dd")))
            {
                const string detail = $"The date you tried to reserve is no longer available, Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}";
                string instance = Request.Path.ToString();
                const string title = "Date no longer available.";

                _memoryCache.Remove("available-days");

                return Problem(detail, instance, StatusCodes.Status409Conflict, title);
            }
        }
        else
        {
            const string detail = $"An error occured when trying to book your appointment. Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}. If this continues, please contact support with this message: \"cache key did not exist\"";
            string instance = Request.Path.ToString();
            const string title = "Cache key didn't exist";

            return Problem(detail, instance, StatusCodes.Status500InternalServerError, title);
        }

        Client? client = _clientRepo.List(new QueryOptions<Client>())
                                    .FirstOrDefault(c => c.PhoneNumber == model.PhoneNumber);
        if (client is null)
        {
            client = new Client()
            {
                Name = model.Name,
                PhoneNumber = model.PhoneNumber
            };

            // must save to increment client's id before appointment can relate to it
            _clientRepo.Insert(client);
            _clientRepo.Save();
        }

        Appointment appointment = new Appointment()
        {
            ClientId = client.Id,
            Client = client,
            Date = model.Date,
            DesiredService = model.DesiredService
        };

        try
        {
            await _calendlyAppointment.CreateAppointment(model);
            _memoryCache.Remove(Tags.AvailableDaysCacheKey); // the date the user just booked is no longer available
        }
        catch (HttpRequestException e)
        {
            string detail;
            string instance;

            if (e.StatusCode is null)
            {
                detail = $"An error occured when trying to book your appointment. Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}. If this continues, please contact support.";
                instance = Request.Path.ToString();

                return Problem(detail, instance, StatusCodes.Status500InternalServerError);
            }

            int statusCode = (int)e.StatusCode.Value;
            instance = Request.Path.ToString();
            const string title = "Calendly API rejection";

            switch (statusCode)
            {
                case StatusCodes.Status403Forbidden:
                    // Access to the "/invitees" endpoint is limited to Calendly users on paid plans (Standard and above). Users on the Free plan will receive a 403 Forbidden response.
                    detail = $"Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}.";
                    break;
                default:
                    detail = $"Unfortunately, an error occured when trying to book your appointment. Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}. If this continues, please contact support with this code: {statusCode}";
                    break;
            }

            return Problem(detail, instance, statusCode, title);
        }
        catch (Exception e)
        {
            const string detail = $"An error occured when trying to book your appointment. Please contact the salon to directly schedule an appointment at {Tags.BusinessPhone}. If this continues, please contact support.";
            string instance = Request.Path.ToString();
            const string title = "Cache key didn't exist";

            return Problem(detail, instance, StatusCodes.Status500InternalServerError, title);
        }

        _appointmentRepo.Insert(appointment);
        _appointmentRepo.Save();

        return Ok();
    }
}
