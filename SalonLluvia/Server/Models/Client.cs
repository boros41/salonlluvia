using System.ComponentModel.DataAnnotations;

namespace Server.Models;

public class Client
{
    public int Id { get; set; }

    [Display(Name = "Client")]
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Display(Name = "Phone Number")]
    [Required]
    [StringLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Display(Name = "Email")]
    [Required]
    [StringLength(254, ErrorMessage = "Email must be 254 characters or less")]
    public string Email { get; set; } = string.Empty;
}