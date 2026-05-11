using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Server.Dto.Account;
using Server.Models;
using Server.Models.ViewModels;
using SignInResult = Microsoft.AspNetCore.Identity.SignInResult;

namespace Server.Controllers.Api;

[Route("[controller]")]
[ApiController]
public class AccountController : ControllerBase
{
    private readonly SignInManager<User> _signInManager;

    public AccountController(SignInManager<User> signInManager)
    {
        _signInManager = signInManager;
    }

    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LogIn(LoginViewModel model)
    {
        SignInResult result = await _signInManager.PasswordSignInAsync(model.Username, model.Password, model.RememberMe, false);

        if (!result.Succeeded)
        {
            const string detail = "Invalid username/password";
            string instance = Request.Path.ToString();
            return Problem(detail, instance, StatusCodes.Status400BadRequest);
        }

        /*if (IsReturnUrlLocal(model))
        {
            return StatusCode(StatusCodes.Status302Found, new { returnUrl = model.ReturnUrl });
        }*/

        return Ok();
    }

    [HttpPost]
    [Route("logout")]
    public async Task<IActionResult> LogOut(object empty)
    {
        // https://learn.microsoft.com/en-us/aspnet/core/security/authentication/identity-api-authorization?view=aspnetcore-9.0#prerequisites:~:text=in%20this%20article.-,Log%20out,-To%20provide%20a
        if (empty is not null)
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }

        return Unauthorized();
    }

    [HttpGet]
    [Route("me")]
    public IActionResult Me()
    {
        CurrentUserResponse user = new CurrentUserResponse()
        {
            Username = User.Identity?.Name,
            IsAdmin = User.IsInRole("Admin"),
            IsLoggedIn = _signInManager.IsSignedIn(User)
        };

        return Ok(user);
    }

    [NonAction]
    private bool IsReturnUrlLocal(LoginViewModel model)
    {
        return !string.IsNullOrEmpty(model.ReturnUrl) && Url.IsLocalUrl(model.ReturnUrl);
    }
}
