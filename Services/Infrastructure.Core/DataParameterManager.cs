using System;
using System.Data;
using System.Data.SqlClient;

namespace Infrastructure.Core
{
   public class DataParameterManager
   {
      public static IDbDataParameter CreateParameter(DataProviderType providerName, string name, object value, DbType dbType, ParameterDirection direction = ParameterDirection.Input)
      {
         IDbDataParameter parameter = null;
         switch (providerName)
         {
            case DataProviderType.SqlServer:
               return CreateSqlParameter(name, value, dbType, direction);
         }
         return parameter;
      }

      public static IDbDataParameter CreateParameter(DataProviderType providerName, string name, int size, object value, DbType dbType, ParameterDirection direction = ParameterDirection.Input)
      {
         IDbDataParameter parameter = null;
         switch (providerName)
         {
            case DataProviderType.SqlServer:
               return CreateSqlParameter(name, size, value, dbType, direction);
         }
         return parameter;
      }
      private static IDbDataParameter CreateSqlParameter(string name, object value, DbType dbType, ParameterDirection direction)
      {
         return new SqlParameter
         {
            DbType = dbType,
            ParameterName = name,
            Direction = direction,
            Value = value ?? DBNull.Value,
            IsNullable = true
         };
      }
      private static IDbDataParameter CreateSqlParameter(string name, int size, object value, DbType dbType, ParameterDirection direction)
      {
         return new SqlParameter
         {
            DbType = dbType,
            Size = size,
            ParameterName = name,
            Direction = direction,
            Value = value ?? DBNull.Value,
            IsNullable = true
         };
      }
   }
}
