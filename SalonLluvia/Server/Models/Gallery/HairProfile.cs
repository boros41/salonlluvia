using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery;

public class HairProfile
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Please enter a gender.")]
    [StringLength(6, ErrorMessage = "Gender must be 6 characters or less.")]
    public string Gender { get; set; } = string.Empty;

    /*many-to-many relationship discovered by convention w/ skip navigations

    HairProfile to HairStyle: many-to-many. 
    A person's hair profile can have many hairstyles (e.g., long, braids, etc.) and one 
    hairstyle can have many hair profiles (e.g., different colors, gender, etc.).

    HairProfile to HairColor: many-to-many.
    A person's hair profile can have many hair colors (e.g., black, blonde, etc.) and one 
    hair color can have many hair profiles (e.g., different hairstyles, gender, etc.)*/
    public List<HairStyle> HairStyles { get; } = [];
    public List<HairColor> HairColors { get; } = [];
}