using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery.ViewModels;

public class HairstyleCheckboxVm
{
    [Required(ErrorMessage = "Please enter a hair type (e.g., peinado).")]
    [StringLength(20, ErrorMessage = "Hair type must be 20 characters or less.")]
    public string Style { get; set; } = string.Empty;
    //public bool IsChecked { get; set; }
}