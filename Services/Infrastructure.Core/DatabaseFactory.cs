
using Microsoft.Extensions.Configuration;
using System.Configuration;

namespace Infrastructure.Core
{
   public enum DataProviderType 
   { 
      SqlServer
   }
   public class DatabaseFactory
   {
      protected DataProviderType TypeProviderDB { get; set; }
      protected ConnectionStringSettings connectionStringSettings;
      public IConfigurationRoot Configuration { get; }
      protected string conString { get; set; }
      private IConfiguration _configuration;
      public DatabaseFactory(string connectionStringName, IConfiguration configuration)
      {
         _configuration = configuration;
         conString = configuration["ConnectionStrings:DBConnection:ConnectionString"];

      }

      public IDatabase CreateDatabase()
      {
         IDatabase database = null;

         var ProviderName = _configuration["ConnectionStrings:DBConnection:ProviderName"];
         switch (ProviderName.ToLower())
         {
            case "system.data.sqlclient":
               database = new SqlDataAccess(conString);
               TypeProviderDB = DataProviderType.SqlServer;
               break;
         }
         return database;
      }

      public string GetProviderName()
      {
         return connectionStringSettings.ProviderName;
      }

      public DataProviderType GetTypeProviderDB()
      {
         return TypeProviderDB;
      }
   }
}
