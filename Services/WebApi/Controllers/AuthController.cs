using System;
using System.Collections.Generic;
using System.Linq;
using Application.Entities.Auth;
using Application.Response;
using Domain.Model.Entities.Auth.Filters;
using Domain.Model.Entities.Auth.ResulSet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
   [Produces("application/json")]
   [Route("api/[controller]")]
   [ApiController]
   public class AuthController : ControllerBase
   {
      private AuthService _authService { get; }
      private readonly ILogger<AuthController> _logger;

      public AuthController(IConfiguration configuration, ILogger<AuthController> logger)
      {
         _logger = logger;
         _authService = new AuthService(configuration);
      }

      [HttpPost("token")]
      public Result<ResultSetToken> Token([FromBody] SignInFilter user)
      {
         try
         {
            var item = _authService.SignIn(user);
            if (item != null && item.ResultType == ResultType.Ok)
            {
               var date = DateTime.UtcNow;
               var expireDate = TimeSpan.FromHours(18);
               var expireDateTime = date.Add(expireDate);

               var token = _authService.GenerateToken(date, item.Data, expireDate, expireDateTime);

               if (token.ResultType == ResultType.Unexpected)
               {
                  _logger.LogError(token.exception, token.exception.Message);
               }
               return token;
            }
            else
            {
               return new InvalidResult<ResultSetToken>("Usuario y/o contraseña incorrecta");
            }
         }
         catch (Exception e)
         {
            _logger.LogError(e, e.Message);
            return new UnexpectedResult<ResultSetToken>(e);
         }
      }
   }
}
