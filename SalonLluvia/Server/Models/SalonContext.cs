using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Server.Models.Gallery;

namespace Server.Models;

public class SalonContext : IdentityDbContext<User>
{
    public SalonContext(DbContextOptions<SalonContext> options) : base(options) { }

    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<Image> Images { get; set; } = null!;
    public DbSet<HairProfile> HairProfiles { get; set; } = null!;
    public DbSet<HairStyle> HairStyles { get; set; } = null!;
    public DbSet<HairColor> HairColors { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        #region HairStyle HairColor Lookup Data
        modelBuilder.Entity<HairStyle>().HasData(
            new HairStyle() { Id = 1, Style = "peinado" },
            new HairStyle() { Id = 2, Style = "tinte" },
            new HairStyle() { Id = 3, Style = "chino" },
            new HairStyle() { Id = 4, Style = "trenzas" },
            new HairStyle() { Id = 5, Style = "corte" },
            new HairStyle() { Id = 6, Style = "largo" },
            new HairStyle() { Id = 7, Style = "corto" },
            new HairStyle() { Id = 8, Style = "liso" },
            new HairStyle() { Id = 9, Style = "otro" }
        );

        modelBuilder.Entity<HairColor>().HasData(
            new HairColor() { Id = 1, Color = "negro" },
            new HairColor() { Id = 2, Color = "cafe" },
            new HairColor() { Id = 3, Color = "rubio" },
            new HairColor() { Id = 4, Color = "rojo" },
            new HairColor() { Id = 5, Color = "mixto" },
            new HairColor() { Id = 6, Color = "azul" },
            new HairColor() { Id = 7, Color = "morado" },
            new HairColor() { Id = 8, Color = "rosa" }
            );
        #endregion
    }
}