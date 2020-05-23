using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Entities.Infected;
using Application.Response;
using Domain.Model.Entities.Infected.ResultSet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebApi.Controllers
{
   [Produces("application/json")]
   [Route("api/[controller]")]
   [ApiController]
   public class InfectedController : ControllerBase
   {
      private InfectedService _infectedService { get; }
      private readonly ILogger<InfectedController> _logger;

      public InfectedController(IConfiguration configuration, ILogger<InfectedController> logger)
      {
         _logger = logger;
         _infectedService = new InfectedService(configuration);
      }

      [Authorize]
      [HttpGet]
      public Result<List<ResultSetListInfecteds>> GetInfecteds()
      {
         try
         {
            return _infectedService.GetInfecteds();
         }
         catch (Exception e)
         {
            _logger.LogError(e, e.Message);
            return new UnexpectedResult<List<ResultSetListInfecteds>>(e);
         }
        
      }
   }
}
