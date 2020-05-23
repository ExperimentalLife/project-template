using Application.Response;
using Domain.Model.Abstractions.Infected;
using Domain.Model.Entities.Infected.ResultSet;
using Infrastructure.DataAccess.Repository.Infected;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Entities.Infected
{
   public class InfectedService
   {
      private readonly IInfectedRepository _repository;

      public InfectedService(IConfiguration configuration)
      {
         _repository = new InfectedRepository(configuration);
      }

      public Result<List<ResultSetListInfecteds>> GetInfecteds()
      {
         try
         {
            var items = _repository.GetInfecteds();
            return new SuccessResult<List<ResultSetListInfecteds>>(items);
         }
         catch (Exception ex)
         {

            return new UnexpectedResult<List<ResultSetListInfecteds>>(ex);
         }
      }

   }
}
