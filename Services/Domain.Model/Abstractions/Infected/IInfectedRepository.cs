using Domain.Model.Entities.Infected.Entity;
using Domain.Model.Entities.Infected.ResultSet;
using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Model.Abstractions.Infected
{
   public interface IInfectedRepository : IGenericRepository<InfectedModel>
   {
      List<ResultSetListInfecteds> GetInfecteds();
   }
}
