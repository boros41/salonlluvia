using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Server.Integrations.Calendly;
using Server.Utilities;
using System.Text.Json;

namespace Server.Controllers.Api;

[Route("api/[controller]")]
[ApiController]
public class CalendlyController : ControllerBase
{
    private readonly ICalendlyAvailableDays _availableDays;
    private readonly IMemoryCache _memoryCache;

    public CalendlyController(ICalendlyAvailableDays availableDays, IMemoryCache memoryCache)
    {
        _availableDays = availableDays;
        _memoryCache = memoryCache;
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
            }) ?? throw new InvalidOperationException($"Value for memory cache \"{Tags.AvailableDaysCacheKey}\" was null");

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
}
