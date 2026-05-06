using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Appointment
{
    public int Id { get; set; }

    [Display(Name = "Client ID")]
    [Required(ErrorMessage = "Please enter a client")]
    public int? ClientId { get; set; }

    [ValidateNever]
    public Client Client { get; set; } = null!;

    [Display(Name = "Date")]
    [Required]
    public DateTime? Date { get; set; }

    [Display(Name = "Desired Service")]
    [Required]
    [StringLength(200)]
    public string DesiredService { get; set; } = string.Empty;
}