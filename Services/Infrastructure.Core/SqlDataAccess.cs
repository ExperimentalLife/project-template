using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Infrastructure.Core
{
   public class SqlDataAccess : IDatabase
   {
      private string ConnectionString { get; set; }
      protected IDbConnection connection { get; set; }
      protected static IDbTransaction transactionScope { get; set; }
      protected string Server { get; private set; }
      protected string Database { get; private set; }
      public SqlDataAccess(string connectionString)
      {
         ConnectionString = connectionString;
      }

      public IDbConnection GetConnection()
      {
         return connection;
      }
      public IDbConnection CreateConnection()
      {
         connection = new SqlConnection(ConnectionString);
         return connection;
      }
      public void CloseConnection()
      {
         var sqlConnection = (SqlConnection)connection;
         sqlConnection.Close();
         sqlConnection.Dispose();
      }

      public IDbCommand CreateCommand(string commandText, CommandType commandType, IDbConnection connection)
      {
         return new SqlCommand
         {
            CommandText = commandText,
            Connection = (SqlConnection)connection,
            CommandType = commandType
         };
      }
      public IDbCommand CreateCommand(string commandText, CommandType commandType, IDbConnection connection, IDbTransaction transactionScope)
      {
         return new SqlCommand
         {
            CommandText = commandText,
            Connection = (SqlConnection)connection,
            CommandType = commandType,
            Transaction = (SqlTransaction)transactionScope
         };
      }
      public IDataAdapter CreateAdapter(IDbCommand command)
      {
         return new SqlDataAdapter((SqlCommand)command);
      }

      public IDbDataParameter CreateParameter(IDbCommand command)
      {
         SqlCommand SQLcommand = (SqlCommand)command;
         return SQLcommand.CreateParameter();
      }

      public IDbTransaction BeginTransaction()
      {
         CreateConnection();
         var sqlConnection = (SqlConnection)connection;
         if (sqlConnection.State != ConnectionState.Open)
            sqlConnection.Open();

         transactionScope = sqlConnection.BeginTransaction();
         return transactionScope;
      }

      public void CommitTransaction()
      {
         if (transactionScope != null)
         {
            transactionScope.Commit();
            connection.Close();
            connection.Dispose();
            transactionScope = null;
         }
      }

      public void RollbackTransaction()
      {
         if (transactionScope != null)
         {
            transactionScope.Rollback();
            connection.Close();
            connection.Dispose();
            transactionScope = null;
         }
      }
      public List<string> GetInfoConnection()
      {
         CreateConnection();
         SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder
         {
            ConnectionString = connection.ConnectionString
         };
         Server = builder.DataSource;
         Database = builder.InitialCatalog;
         var list = new List<string>();
         list.Add(Server);
         list.Add(Database);
         return list;
      }

      private bool disposedValue = false; 

      protected virtual void Dispose(bool disposing)
      {
         if (!disposedValue)
         {
            if (disposing)
            {
               connection.Dispose();
            }

            disposedValue = true;
         }
      }
      public void Dispose()
      {
         Dispose(true);
         GC.SuppressFinalize(this);
      }
   }
}
