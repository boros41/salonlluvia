namespace Server.Data.Repository;

public interface IRepository<TEntity> where TEntity : class
{
    void Insert(TEntity entity);
    IEnumerable<TEntity> List(QueryOptions<TEntity> options);
    TEntity? Get(int id);
    void Update(TEntity entity);
    void Delete(TEntity entity);
    void Save();
}