

using Domain.Model.Abstractions;
using Domain.Model.Abstractions.Infected;
using Infrastructure.DataAccess.Repository.Auth;
using Infrastructure.DataAccess.Repository.Infected;
using Microsoft.Extensions.DependencyInjection;

namespace WebApi.Middleware
{
   public static class IoC
   {
      public static IServiceCollection AddRegistration(this IServiceCollection services)
      {
         services.AddTransient<IAuthRepository, AuthRepository>();
         services.AddTransient<IInfectedRepository, InfectedRepository>();
         return services;
      }
   }

}
