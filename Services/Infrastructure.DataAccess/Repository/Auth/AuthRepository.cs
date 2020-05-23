using System;
using System.Collections.Generic;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Domain.Model.Abstractions;
using Domain.Model.Entities.Auth.Entity;
using Domain.Model.Entities.Auth.Filters;
using Domain.Model.Entities.Auth.ResulSet;
using Domian.Common.Constants;
using Infrastructure.Core;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.DataAccess.Repository.Auth
{
   public class AuthRepository: IGenericRepository<AuthModel>,IAuthRepository
   {
      protected DBManager dbManager { get; private set; }
      protected IConfiguration _configuration { get; set; }
      public AuthRepository(IConfiguration configuration)
      {
         AuthModel item = new AuthModel();
         _configuration = configuration;
         dbManager = new DBManager("DBConnection", configuration);
      }

      public ResulSetUser SignIn(SignInFilter filter)
      {
         try
         {
            var item = new ResulSetUser();
            var parameters = new List<IDbDataParameter>();
            parameters.Add(dbManager.CreateParameter("@P_username", 20, filter.Username, DbType.String));
            parameters.Add(dbManager.CreateParameter("@P_password", 20, filter.Password, DbType.String));
            var items = dbManager.GetDataReader<ResulSetUser>(Procedures.PRTE_USESS_AUTH, CommandType.StoredProcedure, parameters.ToArray()).ToList();
            if (items != null && items.Count > 0)
            {
               item = items[0];
            }
            return item;
         }
         catch (Exception ex)
         {

            throw ex;
         }
      }

      public string GenerateToken(DateTime date, string user, TimeSpan validDate)
      {

         var expire = date.Add(validDate);

         var claims = new Claim[]
         {
                new Claim(JwtRegisteredClaimNames.Sub, user),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(
                    JwtRegisteredClaimNames.Iat,
                    new DateTimeOffset(date).ToUniversalTime().ToUnixTimeSeconds().ToString(),
                    ClaimValueTypes.Integer64
                ),
                new Claim("roles","Cliente"),
                new Claim("roles","Administrador")
         };

         var issuer = _configuration["AuthenticationSettings:Issuer"];
         var audience = _configuration["AuthenticationSettings:Audience"];
         var signingKey = _configuration["AuthenticationSettings:SigningKey"];

         var signingCredentials = new SigningCredentials(
             new SymmetricSecurityKey(Encoding.ASCII.GetBytes(signingKey)),
             SecurityAlgorithms.HmacSha256Signature
         );

         var jwt = new JwtSecurityToken(
         issuer: issuer,
         audience: audience,
         claims: claims,
         notBefore: date,
         expires: expire,
         signingCredentials: signingCredentials
         );

         var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
         return encodedJwt;
      }

      public List<string> GetServerName_DataBaseName()
      {
         throw new NotImplementedException();
      }

      public Task<AuthModel> GetOneAsync(int nombre)
      {
         throw new NotImplementedException();
      }

      public AuthModel GetOne(int nombre)
      {
         throw new NotImplementedException();
      }

      public Task<IEnumerable<AuthModel>> GetAllAsync()
      {
         throw new NotImplementedException();
      }

      public IEnumerable<AuthModel> GetAll()
      {
         throw new NotImplementedException();
      }

      public Task<bool> SaveAsync(ref AuthModel entity)
      {
         throw new NotImplementedException();
      }

      public bool Save(ref AuthModel entity)
      {
         throw new NotImplementedException();
      }

      public Task<bool> SaveAsync(IEnumerable<AuthModel> entities)
      {
         throw new NotImplementedException();
      }

      public bool Save(ref IEnumerable<AuthModel> entities)
      {
         throw new NotImplementedException();
      }
   }
}
