using Microsoft.EntityFrameworkCore;

namespace Server.Data.Repository;

public class Repository<TEntity> : IRepository<TEntity> where TEntity : class
{
    protected DbContext Context { get; init; }
    private DbSet<TEntity> DbSet { get; }

    public Repository(DbContext ctx)
    {
        Context = ctx;
        DbSet = ctx.Set<TEntity>();
    }

    public virtual void Insert(TEntity entity)
    {
        DbSet.Add(entity);
    }

    public virtual IEnumerable<TEntity> List(QueryOptions<TEntity> options)
    {
        IQueryable<TEntity> query = DbSet;

        foreach (string include in options.GetIncludes())
        {
            if (options.GetThenIncludes().Length == 0)
            {
                query = query.Include(include);

                continue;
            }

            foreach (string thenInclude in options.GetThenIncludes())
            {
                // Further navigation properties to be included can be appended, separated by the "." character.
                // https://learn.microsoft.com/en-us/dotnet/api/microsoft.entityframeworkcore.entityframeworkqueryableextensions.include?view=efcore-10.0&utm_source=chatgpt.com#microsoft-entityframeworkcore-entityframeworkqueryableextensions-include-1(system-linq-iqueryable((-0))-system-string):~:text=queried%20(TEntity).-,Further%20navigation%20properties%20to%20be%20included%20can%20be%20appended%2C%20separated%20by%20the%20%27.%27%20character.,-C%23
                query = query.Include(include + "." + thenInclude);
            }
        }

        if (options.HasWhere)
        {
            query = query.Where(options.Where);
        }

        if (options.HasGenderFilter)
        {
            query = query.Where(options.GenderFilter);
        }

        if (options.HasHairstyleFilters)
        {
            // since there can be multiple hairstyle filters, we need a list of predicates for a chain of Where() calls
            query = query.Where(options.HairstylePredicate);
        }

        if (options.HasHairColorFilters)
        {
            query = query.Where(options.HairColorPredicate);
        }

        if (options.HasOrderBy)
        {
            query = query.OrderBy(options.OrderBy);
        }

        return query.ToList();
    }

    public virtual TEntity? Get(int id)
    {
        return DbSet.Find(id);
    }

    public virtual void Update(TEntity entity)
    {
        DbSet.Update(entity);
    }

    public virtual void Delete(TEntity entity)
    {
        DbSet.Remove(entity);
    }

    public void Save()
    {
        Context.SaveChanges();
    }
}