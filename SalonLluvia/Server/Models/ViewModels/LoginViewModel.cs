using System.ComponentModel.DataAnnotations;

namespace Server.Models.ViewModels;

public sealed class LoginViewModel
{
    [Required(ErrorMessage = "Please enter a username.")]
    [StringLength(32, MinimumLength = 3)]
    public string Username { get; set; } = string.Empty;
    [Required(ErrorMessage = "Please enter a password.")]
    [StringLength(255)]
    public string Password { get; set; } = string.Empty;
    public bool RememberMe { get; set; }
    public string ReturnUrl { get; set; } = string.Empty;
}