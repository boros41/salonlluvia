using System.Linq.Expressions;

namespace Server.Data.Repository;

public sealed class QueryOptions<TEntity> where TEntity : class
{
    public Expression<Func<TEntity, bool>> Where { get; set; } = null!;
    public Expression<Func<TEntity, object>> OrderBy { get; set; } = null!;
    public Expression<Func<TEntity, bool>> GenderFilter { get; set; } = null!;
    public Expression<Func<TEntity, bool>> HairstylePredicate { get; set; } = null!;
    public Expression<Func<TEntity, bool>> HairColorPredicate { get; set; } = null!;
    public List<string> FilterHairstyles { get; set; } = [];
    public List<string> FilterHairColors { get; set; } = [];

    private string[] _includes = [];
    public string Includes
    {
        set => _includes = value.Replace(" ", "").Split(",");
    }

    public string[] GetIncludes()
    {
        return _includes;
    }

    private string[] _thenIncludes = [];
    public string ThenIncludes
    {
        set => _thenIncludes = value.Replace(" ", "").Split(",");
    }

    public string[] GetThenIncludes()
    {
        return _thenIncludes;
    }

    public bool HasWhere => Where is not null;
    public bool HasOrderBy => OrderBy is not null;
    public bool HasGenderFilter => GenderFilter is not null;
    public bool HasHairstyleFilters => FilterHairstyles.Count != 0 && HairstylePredicate is not null;
    public bool HasHairColorFilters => FilterHairColors.Count != 0 && HairColorPredicate is not null;
}