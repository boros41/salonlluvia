using Server.Validation;
using System.ComponentModel.DataAnnotations;

namespace Server.Models.ViewModels;

public class AppointmentViewModel
{
    [Required(ErrorMessage = "Please enter a name")]
    [StringLength(100, ErrorMessage = "Name must be 100 characters or less")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter a phone number")]
    [StringLength(20, ErrorMessage = "Phone number must be 20 characters or less")]
    [PhoneNumber]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter a date")]
    public DateTime? Date { get; set; }

    [Required(ErrorMessage = "Please enter an email")]
    [StringLength(254, ErrorMessage = "Email must be 254 characters or less")]
    [Email(ErrorMessage = "Please enter a valid email")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter a desired service")]
    [StringLength(200, ErrorMessage = "Service must be 200 characters or less")]
    public string DesiredService { get; set; } = string.Empty;
}
