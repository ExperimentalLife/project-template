using Application.Response;
using Application.Validators.Auth;
using Domain.Model.Abstractions;
using Domain.Model.Entities.Auth.Filters;
using Domain.Model.Entities.Auth.ResulSet;
using Infrastructure.DataAccess.Repository.Auth;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Entities.Auth
{
   public class AuthService
   {
      private readonly IAuthRepository _repository;
      private readonly AuthValidator _validatorFactory;

      public AuthService(IConfiguration configuration)
      {
         _repository = new AuthRepository(configuration);
         _validatorFactory = new AuthValidator();
      }

      public Result<ResulSetUser> SignIn(SignInFilter filter)
      {
         try
         {
            var _result = _validatorFactory.Validate(filter);
            if (!_result.IsValid)
            {
               List<string> _errores = new List<string>();
               foreach (var error in _result.Errors)
               {
                  _errores.Add(error.ErrorMessage);
               }
               return new InvalidResult<ResulSetUser>(_errores);
            }
            var items = _repository.SignIn(filter);
            return new SuccessResult<ResulSetUser>(items);
         }
         catch (Exception ex)
         {

            return new UnexpectedResult<ResulSetUser>(ex);
         }
      }
      public Result<ResultSetToken> GenerateToken(DateTime date, ResulSetUser user, TimeSpan validDate, DateTime expireDateTime)
      {
         try
         {
            var token = _repository.GenerateToken(date, user.USER_name, validDate);
            var res = new ResultSetToken
            {
               authToken = token,
               email = "allamocca@experimentallife.dev",//user.USER_username,
               firstName = user.USER_firstName,
               id = user.USER_id,
               idToken = "",
               lastName = user.USER_lastName,
               name = user.USER_name,
               photoUrl = user.USER_photoUrl,
               provider = "OWNER",
               fecha_expiracion = expireDateTime
            };
            return new SuccessResult<ResultSetToken>(res);
         }
         catch (Exception ex)
         {
            return new UnexpectedResult<ResultSetToken>(ex);
         }
      }
      public Result<List<string>> GetServerDataBaseName()
      {
         try
         {
            var items = _repository.GetServerName_DataBaseName();
            return new SuccessResult<List<string>>(items);
         }
         catch (Exception ex)
         {

            return new UnexpectedResult<List<string>>(ex);
         }
      }
   }
}
