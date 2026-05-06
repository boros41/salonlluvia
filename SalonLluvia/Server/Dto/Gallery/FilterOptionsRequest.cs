namespace Server.Dto.Gallery;

public sealed record FilterOptionsRequest
{
    public string Gender { get; init; } = "both";
    public List<string> Hairstyles { get; init; } = [];
    public List<string> HairColors { get; init; } = [];
}