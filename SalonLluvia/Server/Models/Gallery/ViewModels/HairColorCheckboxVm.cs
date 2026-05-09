using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery.ViewModels;

public class HairColorCheckboxVm
{
    [Required(ErrorMessage = "Please enter a hair color (e.g., black).")]
    [StringLength(20, ErrorMessage = "Hair color must be 20 characters or less.")]
    public string Color { get; set; } = string.Empty;
    //public bool IsChecked { get; set; }
}