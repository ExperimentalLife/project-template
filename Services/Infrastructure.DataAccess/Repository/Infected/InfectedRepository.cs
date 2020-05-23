using Domain.Model.Abstractions;
using Domain.Model.Abstractions.Infected;
using Domain.Model.Entities.Infected.Entity;
using Domain.Model.Entities.Infected.ResultSet;
using Domian.Common.Constants;
using Infrastructure.Core;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.DataAccess.Repository.Infected
{
   public class InfectedRepository : IGenericRepository<InfectedModel>, IInfectedRepository
   {
      protected DBManager dbManager { get; private set; }
      protected IConfiguration _configuration { get; set; }
      public InfectedRepository(IConfiguration configuration)
      {
         InfectedModel item = new InfectedModel();
         _configuration = configuration;
         dbManager = new DBManager("DBConnection", configuration);
      }



      public IEnumerable<InfectedModel> GetAll()
      {
         throw new NotImplementedException();
      }

      public Task<IEnumerable<InfectedModel>> GetAllAsync()
      {
         throw new NotImplementedException();
      }

      public InfectedModel GetOne(int nombre)
      {
         throw new NotImplementedException();
      }

      public Task<InfectedModel> GetOneAsync(int nombre)
      {
         throw new NotImplementedException();
      }

      public bool Save(ref InfectedModel entity)
      {
         throw new NotImplementedException();
      }

      public bool Save(ref IEnumerable<InfectedModel> entities)
      {
         throw new NotImplementedException();
      }

      public Task<bool> SaveAsync(ref InfectedModel entity)
      {
         throw new NotImplementedException();
      }

      public Task<bool> SaveAsync(IEnumerable<InfectedModel> entities)
      {
         throw new NotImplementedException();
      }

      public List<ResultSetListInfecteds> GetInfecteds()
      {
         try
         {
            var item = new ResultSetListInfecteds();
            var parameters = new List<IDbDataParameter>();
            var items = dbManager.GetDataReader<ResultSetListInfecteds>(Procedures.PRTE_NFESS_GET_INFECTEDS, CommandType.StoredProcedure, parameters.ToArray()).ToList();
            return items;
         }
         catch (Exception ex)
         {

            throw ex;
         }
      }
   }
}
