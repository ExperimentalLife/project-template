using System;
using System.Collections.Generic;
using System.Data;

namespace Infrastructure.Core
{
   public interface IDatabase : IDisposable
   {
      IDbConnection GetConnection();
      IDbConnection CreateConnection();
      void CloseConnection();
      IDbCommand CreateCommand(string commandText, CommandType commandType, IDbConnection connection);
      IDbCommand CreateCommand(string commandText, CommandType commandType, IDbConnection connection, IDbTransaction transactionScope);
      IDataAdapter CreateAdapter(IDbCommand command);
      IDbDataParameter CreateParameter(IDbCommand command);
      IDbTransaction BeginTransaction();
      void CommitTransaction();
      void RollbackTransaction();
      List<string> GetInfoConnection();
   }
}
