using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery.ViewModels;

public class ImageViewModel
{
    [StringLength(50, ErrorMessage = "Description must be 50 characters or less.")]
    public string? Description { get; set; }

    [Required(ErrorMessage = "Please enter an image.")]
    public IFormFile Image { get; set; } = null!;

    [Required(ErrorMessage = "Please enter a gender.")]
    [StringLength(6, ErrorMessage = "Gender must be 6 characters or less.")]
    public string Gender { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please enter a style (e.g., peinado).")]
    public List<HairstyleCheckboxVm> HairStyles { get; set; } = [];

    [Required(ErrorMessage = "Please enter a hair color.")]
    public List<HairColorCheckboxVm> HairColors { get; set; } = [];

    public bool IsFiltered { get; set; }
}