using Domain.Model.Abstractions;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure.DataAccess
{
   public abstract class GenericRepository<T, TRepository> : IGenericRepository<T>
   {
      public TRepository Repository { get; set; }
      public IEnumerable<T> GetAll()
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.GetAll();
         }
         catch (Exception ex)
         { throw ex; }
      }

      public Task<IEnumerable<T>> GetAllAsync()
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.GetAll();
         }
         catch (Exception ex)
         { throw ex; }
      }

      public T GetOne(int nombre)
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.GetOne(nombre);
         }
         catch (Exception ex)
         { throw ex; }
      }

      public Task<T> GetOneAsync(int nombre)
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.GetOne(nombre);
         }
         catch (Exception ex)
         { throw ex; }
      }

      public bool Save(ref T entity)
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.Save(ref entity);
         }
         catch (Exception ex)
         {
            Console.WriteLine(ex.ToString());
            throw ex;
         }
      }

      public bool Save(ref IEnumerable<T> entities)
      {
         try
         {
            dynamic rep = this.Repository;
            for (int i = 0; i < entities.GetType().GenericTypeArguments.Length; i++)
            {
               var item = entities.GetType().GenericTypeArguments[i];
               rep.Save(ref item);
            }
            return true;
         }
         catch (Exception ex)
         { throw ex; }
      }

      public Task<bool> SaveAsync(ref T entity)
      {
         try
         {
            dynamic rep = this.Repository;
            return rep.Save(ref entity);
         }
         catch (Exception ex)
         {
            Console.WriteLine(ex.ToString());
            throw ex;
         }
      }

      public Task<bool> SaveAsync(IEnumerable<T> entities)
      {
         try
         {
            dynamic rep = this.Repository;
            for (int i = 0; i < entities.GetType().GenericTypeArguments.Length; i++)
            {
               var item = entities.GetType().GenericTypeArguments[i];
               rep.Save(ref item);
            }
            return rep.Save(rep);
         }
         catch (Exception ex)
         { throw ex; }
      }
   }
}
