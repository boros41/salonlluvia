using System.ComponentModel.DataAnnotations;

namespace Server.Models.Gallery;

// Seeded as lookup data in SalonContext.cs
public class HairColor
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Please enter a hair color (e.g., black).")]
    [StringLength(20, ErrorMessage = "Hair color must be 20 characters or less.")]
    public string Color { get; init; } = string.Empty;

    /*many-to-many relationship discovered by convention w/ skip navigations

    HairColor to HairProfile: many-to-many.
    A person's hair profile can have many hair colors (e.g., black, blonde, etc.) and one 
    hair color can have many hair profiles (e.g., different hairstyles, gender, etc.)*/
    public List<HairProfile> HairProfiles { get; } = [];
}