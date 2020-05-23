using Domain.Model.Entities.Auth.Entity;
using Domain.Model.Entities.Auth.Filters;
using Domain.Model.Entities.Auth.ResulSet;
using System;
using System.Collections.Generic;

namespace Domain.Model.Abstractions
{
   public interface IAuthRepository : IGenericRepository<AuthModel>
   {
      ResulSetUser SignIn(SignInFilter filter);
      List<string> GetServerName_DataBaseName();

      string GenerateToken(DateTime date, string user, TimeSpan validDate);
   }
}
