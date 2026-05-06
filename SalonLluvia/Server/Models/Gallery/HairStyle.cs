using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery;

// Seeded as lookup data in SalonContext.cs
public class HairStyle
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Please enter a hairstyle (e.g., peinado).")]
    [StringLength(20, ErrorMessage = "Hairstyle must be 20 characters or less.")]
    public string Style { get; init; } = string.Empty;

    /*many-to-many relationship discovered by convention w/ skip navigations

    HairStyle to HairProfile: many-to-many.
    A person's hair profile can have many hairstyles (e.g., long, braids, etc.) and one
    hairstyle can have many hair profiles (e.g., different colors, gender, etc.).*/
    public List<HairProfile> HairProfiles { get; } = [];
}