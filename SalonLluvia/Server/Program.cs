using Azure.Identity;
using Azure.Storage.Blobs;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Server.Data.Repository;
using Server.Integrations.AzureBlobStorage;
using Server.Integrations.AzureBlobStorage.Interfaces;
using Server.Integrations.Calendly;
using Server.Models;
using Server.Models.Gallery;
using Server.Utilities;
using Server.Utilities.Interfaces;

namespace Server;

public class Program
{
    public static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.
        builder.Services.AddAuthorization();

        builder.Services
               .AddIdentityApiEndpoints<User>()
               .AddRoles<IdentityRole>()
               .AddEntityFrameworkStores<SalonContext>();

        builder.Services.AddControllers();

        builder.Services.AddMemoryCache();

        builder.Services.AddOpenApi(); // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

        #region Map dependencies for DI
        // repository pattern
        builder.Services.AddTransient(typeof(IRepository<Appointment>), typeof(Repository<Appointment>));
        builder.Services.AddTransient(typeof(IRepository<Client>), typeof(Repository<Client>));
        builder.Services.AddTransient(typeof(IRepository<HairStyle>), typeof(Repository<HairStyle>));
        builder.Services.AddTransient(typeof(IRepository<HairColor>), typeof(Repository<HairColor>));
        builder.Services.AddTransient(typeof(IRepository<HairProfile>), typeof(Repository<HairProfile>));
        builder.Services.AddTransient(typeof(IRepository<Image>), typeof(Repository<Image>));
        builder.Services.AddTransient(typeof(GalleryData<Image, HairProfile, HairStyle, HairColor>), typeof(GalleryData<Image, HairProfile, HairStyle, HairColor>));

        // Calendly API service
        builder.Services.AddTransient<ICalendlyAvailableDays, CalendlyAvailableDays>();
        builder.Services.AddTransient<ICalendlyAppointment, CalendlyAppointment>();

        // Azure Blob Storage API gateway service
        builder.Services.AddTransient<IAzureBlobStorageImages, AzureBlobStorageImages>();

        // File helper in HomeController.Gallery POST
        builder.Services.AddTransient<IImageHelper, ImageHelper>();

        // Azure Blob Container Client object
        builder.Services.AddSingleton<BlobContainerClient>(sp =>
        {
            const string storageAccountName = "stsalonlluviaimgprod01";
            const string containerName = "gallery-images";

            Uri blobContainerUri = new Uri($"https://{storageAccountName}.blob.core.windows.net/{containerName}");
            BlobContainerClient blobContainerClient;

            if (builder.Environment.IsDevelopment())
            {
                // local development to connect & authenticate to Azure Blob Storage through Azure service principals
                // https://learn.microsoft.com/en-us/dotnet/azure/sdk/authentication/local-development-service-principal?tabs=azure-portal%2Cwindows%2Ccommand-line#assign-roles-to-the-group
                string tenantId = builder.Configuration["AZURE_TENANT_ID"] ?? throw new InvalidOperationException("AZURE_TENANT_ID environment variable not found.");
                string clientId = builder.Configuration["AZURE_CLIENT_ID"] ?? throw new InvalidOperationException("AZURE_CLIENT_ID environment variable not found.");
                string clientSecret = builder.Configuration["AZURE_CLIENT_SECRET"] ?? throw new InvalidOperationException("AZURE_CLIENT_SECRET environment variable not found.");

                blobContainerClient = new BlobContainerClient(
                    blobContainerUri, new ClientSecretCredential(tenantId, clientId, clientSecret));
            }
            else
            {
                // https://learn.microsoft.com/en-us/dotnet/azure/sdk/authentication/system-assigned-managed-identity?tabs=azure-portal%2Ccommand-line#implement-the-code
                blobContainerClient = new BlobContainerClient(
                    blobContainerUri, new ManagedIdentityCredential(ManagedIdentityId.SystemAssigned));
            }

            return blobContainerClient;
        });
        #endregion

        // Add EF Core DI
        builder.Services.AddDbContext<DbContext, SalonContext>(options =>
        {
            string? connectionString = builder.Configuration.GetConnectionString("SalonContext") ?? throw new InvalidOperationException("SalonContext connection string is missing."); ;

            if (builder.Environment.IsDevelopment())
                options.UseSqlServer(connectionString);
            else
                options.UseAzureSql(connectionString);
        });

        var app = builder.Build();

        app.MapIdentityApi<IdentityUser>();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseHttpsRedirection();

        app.UseAuthentication();

        app.UseAuthorization();

        IServiceScopeFactory scopeFactory = app.Services.GetRequiredService<IServiceScopeFactory>();
        using (IServiceScope scope = scopeFactory.CreateScope())
        {
            await ConfigureIdentity.CreateAdminUserAsync(scope.ServiceProvider);
        }

        app.MapControllers();

        await app.RunAsync();
    }
}
