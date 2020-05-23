using System.Collections.Generic;
using System.Threading.Tasks;

namespace Domain.Model.Abstractions
{
   public interface IGenericRepository<T>
   {
      Task<T> GetOneAsync(int nombre);
      T GetOne(int nombre);
      Task<IEnumerable<T>> GetAllAsync();
      IEnumerable<T> GetAll();

      Task<bool> SaveAsync(ref T entity);
      bool Save(ref T entity);

      Task<bool> SaveAsync(IEnumerable<T> entities);
      bool Save(ref IEnumerable<T> entities);
   }
}
