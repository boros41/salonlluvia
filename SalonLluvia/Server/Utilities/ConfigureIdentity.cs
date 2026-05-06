using Microsoft.AspNetCore.Identity;
using Server.Models;

namespace Server.Utilities;

internal static class ConfigureIdentity
{
    public static async Task CreateAdminUserAsync(IServiceProvider provider)
    {
        var roleManager = provider.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = provider.GetRequiredService<UserManager<User>>();
        IConfiguration configuration = provider.GetRequiredService<IConfiguration>();

        string username = configuration["IdentitySeed:Admin:Username"] ?? throw new KeyNotFoundException("Unable to find Admin username in secrets.");
        string password = configuration["IdentitySeed:Admin:Password"] ?? throw new KeyNotFoundException("Unable to find Admin password in secrets.");
        const string roleName = "Admin";

        if (await roleManager.FindByNameAsync(roleName) is null)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }

        if (await userManager.FindByNameAsync(username) is null)
        {
            User user = new User { UserName = username };
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, roleName);
            }
        }
    }
}