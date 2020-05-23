using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Infrastructure.Core
{
   public class DBManager
   {
      private DatabaseFactory dbFactory;
      private IDatabase database;
      private DataProviderType providerName;
      public DBManager(string connectionStringName, IConfiguration Configuration)
      {

         dbFactory = new DatabaseFactory(connectionStringName, Configuration);
         database = dbFactory.CreateDatabase();
         providerName = dbFactory.GetTypeProviderDB();
      }
      public IDbConnection GetDatabaseConnection()
      {
         return database.GetConnection();
      }
      public void CloseConnection()
      {
         database.CloseConnection();
      }
      public List<string> GetInfoConnection()
      {
         return database.GetInfoConnection();
      }
      public IDbTransaction BeginTransaction()
      {
         return database.BeginTransaction();
      }
      public void CommitTransaction()
      {
         database.CommitTransaction();
      }
      public void RollbackTransaction()
      {
         database.RollbackTransaction();
      }
      public IDbDataParameter CreateParameter(string name, object value, DbType dbType)
      {
         return DataParameterManager.CreateParameter(providerName, name, value, dbType, ParameterDirection.Input);
      }
      public IDbDataParameter CreateParameter(string name, int size, object value, DbType dbType)
      {
         return DataParameterManager.CreateParameter(providerName, name, size, value, dbType, ParameterDirection.Input);
      }
      public IDbDataParameter CreateParameter(string name, int size, object value, DbType dbType, ParameterDirection direction)
      {
         return DataParameterManager.CreateParameter(providerName, name, size, value, dbType, direction);
      }
      public DataTable GetDataTable(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         using (var connection = database.CreateConnection())
         {
            connection.Open();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               var dataset = new DataSet();
               var dataAdaper = database.CreateAdapter(command);
               dataAdaper.Fill(dataset);

               return dataset.Tables[0];
            }
         }
      }
      public DataSet GetDataSet(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         using (var connection = database.CreateConnection())
         {
            connection.Open();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               var dataset = new DataSet();
               var dataAdaper = database.CreateAdapter(command);
               dataAdaper.Fill(dataset);

               return dataset;
            }
         }
      }
      public IDataReader GetDataReader(string commandText, CommandType commandType, IDbDataParameter[] parameters, out IDbConnection connection)
      {
         IDataReader reader = null;
         connection = database.CreateConnection();
         connection.Open();

         var command = database.CreateCommand(commandText, commandType, connection);
         if (parameters != null)
         {
            foreach (var parameter in parameters)
            {
               command.Parameters.Add(parameter);
            }
         }

         reader = command.ExecuteReader();

         return reader;
      }
      public IDataReader GetDataReader(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         IDataReader reader = null;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            var command = database.CreateCommand(commandText, commandType, connection);
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            reader = command.ExecuteReader();
         }
         return reader;
      }
      public IEnumerable<T> GetDataReader<T>(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         List<T> data = new List<T>();
         var connection = database.CreateConnection();
         using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
         {
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            using (IDataReader reader = command.ExecuteReader())
            {
               while (reader.Read())
               {
                  T item = Activator.CreateInstance<T>();
                  LoadEntity(reader, item, typeof(T));
                  data.Add(item);
               }
               reader.Close();
            }
         }
         return data;
      }
      public async Task<IEnumerable<T>> GetDataReaderAsync<T>(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         List<T> data = new List<T>();
         using (var connection = database.CreateConnection())
         {
            await connection.OpenAsync();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               using (IDataReader reader = await command.ExecuteReaderAsync())
               {
                  while (await reader.ReadAsync())
                  {
                     T item = Activator.CreateInstance<T>();
                     LoadEntity(reader, item, typeof(T));
                     data.Add(item);
                  }
                  reader.Close();
               }
            }
         }
         return data;
      }
      public async Task<T> GetOneDataReaderAsync<T>(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         T item = Activator.CreateInstance<T>();
         using (var connection = database.CreateConnection())
         {
            await connection.OpenAsync();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               using (IDataReader reader = await command.ExecuteReaderAsync())
               {
                  while (await reader.ReadAsync())
                  {
                     LoadEntity(reader, item, typeof(T));
                  }
                  reader.Close();
               }
            }
         }
         return item;
      }
      public IEnumerable<T> GetDataReader<T>(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         List<T> data = new List<T>();
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               using (IDataReader reader = command.ExecuteReader())
               {
                  while (reader.Read())
                  {
                     T item = Activator.CreateInstance<T>();
                     LoadEntity(reader, item, typeof(T));
                     data.Add(item);
                  }
                  reader.Close();
               }
            }
         }
         return data;
      }
      public IDataReader GetDataReader(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         IDataReader reader = null;
         var connection = database.CreateConnection();
         var command = database.CreateCommand(commandText, commandType, connection, transactionScope);
         if (parameters != null)
         {
            foreach (var parameter in parameters)
            {
               command.Parameters.Add(parameter);
            }
         }
         reader = command.ExecuteReader();
         return reader;
      }
      public bool Delete(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         bool result = false;
         using (var connection = database.CreateConnection())
         {
            connection.Open();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               command.ExecuteNonQuery();
               result = command.ExecuteNonQuery() > 0 ? true : false;
            }
         }
         return result;
      }
      public async Task<bool> DeleteAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         bool result = false;
         using (var connection = database.CreateConnection())
         {
            await connection.OpenAsync();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
            }
         }
         return result;
      }
      public bool Delete(string commandText, CommandType commandType, IDbTransaction transactionScope, IDbDataParameter[] parameters = null)
      {
         bool result = false;
         try
         {

            var connection = database.GetConnection();
            using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = command.ExecuteNonQuery() > 0 ? true : false;
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627: 
                     throw new Exception("Registro Duplicado", selException);
                  case 547: 
                     throw new Exception("No se puede eliminar el registro por tiene relaciones con otras tablas", selException);
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }

      public async Task<bool> DeleteAsync(string commandText, CommandType commandType, IDbTransaction transactionScope, IDbDataParameter[] parameters = null)
      {
         bool result = false;
         var connection = database.GetConnection();
         using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
         {
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
         }
         return result;
      }

      public bool Insert(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         bool result = false;
         try
         {
            var connection = database.GetConnection();
            using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = command.ExecuteNonQuery() > 0 ? true : false;
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               var mesage = selException.Message;
               int index1 = mesage.IndexOf('(');
               int index2 = mesage.IndexOf(')');
               var message = mesage.Substring(index1 + 1, index2 - index1 - 1);
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627: 
                     throw new Exception("Dato ya registrado anteriormente " + message, selException);
                  case 110:
                     break;
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }
      public async Task<bool> InsertAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         bool result = false;
         try
         {
            var connection = database.GetConnection();
            using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627:
                     throw new Exception("Registro Duplicado", selException);
                  case 110:
                     break;
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }
      public bool Insert(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         bool result = false;
         try
         {
            using (var connection = database.CreateConnection())
            {
               connection.Open();
               using (var command = database.CreateCommand(commandText, commandType, connection))
               {
                  if (parameters != null)
                  {
                     foreach (var parameter in parameters)
                     {
                        command.Parameters.Add(parameter);
                     }
                  }
                  result = command.ExecuteNonQuery() > 0 ? true : false;
               }
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               var mesage = selException.Message;
               int index1 = mesage.IndexOf('(');
               int index2 = mesage.IndexOf(')');
               var message = mesage.Substring(index1 + 1, index2 - index1 - 1);
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627: 
                     throw new Exception("Dato ya registrado anteriormente " + message, selException);
                  case 110:
                     break;
                  case 113: 
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }

      public async Task<bool> InsertAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         bool result = false;
         try
         {
            using (var connection = database.CreateConnection())
            {
               await connection.OpenAsync();
               using (var command = database.CreateCommand(commandText, commandType, connection))
               {
                  if (parameters != null)
                  {
                     foreach (var parameter in parameters)
                     {
                        command.Parameters.Add(parameter);
                     }
                  }
                  result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
               }
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627: 
                     throw new Exception("Registro Duplicado", selException);
                  case 110:
                     break;
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }
      public int Insert(string commandText, CommandType commandType, IDbDataParameter[] parameters, out int lastId)
      {
         lastId = 0;
         using (var connection = database.CreateConnection())
         {
            connection.Open();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               object newId = command.ExecuteScalar();
               lastId = Convert.ToInt32(newId);
            }
         }

         return lastId;
      }
      public long Insert(string commandText, CommandType commandType, IDbDataParameter[] parameters, out long lastId)
      {
         lastId = 0;
         using (var connection = database.CreateConnection())
         {
            connection.Open();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               object newId = command.ExecuteScalar();
               lastId = Convert.ToInt64(newId);
            }
         }

         return lastId;
      }
      public bool Insertxxxx(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         bool result = false;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               try
               {
                  command.ExecuteNonQuery();
                  transactionScope.Commit();
                  result = true;
               }
               catch (Exception)
               {
                  transactionScope.Rollback();
                  result = false;
               }
               finally
               {
                  connection.Close();
               }
            }
         }
         return result;
      }
      public void InsertWithTransaction(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         IDbTransaction transactionScope = null;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            transactionScope = connection.BeginTransaction();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               try
               {
                  command.ExecuteNonQuery();
                  transactionScope.Commit();
               }
               catch (Exception)
               {
                  transactionScope.Rollback();
               }
               finally
               {
                  connection.Close();
               }
            }
         }
      }
      public void InsertWithTransaction(string commandText, CommandType commandType, IsolationLevel isolationLevel, IDbDataParameter[] parameters)
      {
         IDbTransaction transactionScope = null;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            transactionScope = connection.BeginTransaction(isolationLevel);

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               try
               {
                  command.ExecuteNonQuery();
                  transactionScope.Commit();
               }
               catch (Exception)
               {
                  transactionScope.Rollback();
               }
               finally
               {
                  connection.Close();
               }
            }
         }
      }
      public bool Update(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         bool result = false;
         try
         {
            using (var connection = database.CreateConnection())
            {
               connection.Open();

               using (var command = database.CreateCommand(commandText, commandType, connection))
               {
                  if (parameters != null)
                  {
                     foreach (var parameter in parameters)
                     {
                        command.Parameters.Add(parameter);
                     }
                  }
                  result = command.ExecuteNonQuery() > 0 ? true : false;
               }
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               var mesage = selException.Message;
               int index1 = mesage.IndexOf('(');
               int index2 = mesage.IndexOf(')');
               var message = mesage.Substring(index1 + 1, index2 - index1 - 1);
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627:
                     throw new Exception("Dato ya registrado anteriormente " + message, selException);
                  case 110:
                     break;
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }
      public async Task<bool> UpdateAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         bool result = false;
         using (var connection = database.CreateConnection())
         {
            await connection.OpenAsync();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
            }
         }
         return result;
      }
      public bool Update(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         bool result = false;
         try
         {
            var connection = database.GetConnection();
            using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               result = command.ExecuteNonQuery() > 0 ? true : false;
            }
         }
         catch (Exception ex)
         {
            if (ex is SqlException)
            {
               SqlException selException = ex as SqlException;
               var mesage = selException.Message;
               int index1 = mesage.IndexOf('(');
               int index2 = mesage.IndexOf(')');
               var message = mesage.Substring(index1 + 1, index2 - index1 - 1);
               SqlError err = selException.Errors[0];
               switch (err.Number)
               {
                  case 2627:
                     throw new Exception("Dato ya registrado anteriormente " + message, selException);
                  case 110:
                     break;
                  case 113:
                     break;
                  case 156:
                     break;
                  default:
                     throw new Exception(ex.Message, ex);
               }
            }
         }
         return result;
      }
      public async Task<bool> UpdateAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters, IDbTransaction transactionScope)
      {
         bool result = false;
         var connection = database.GetConnection();
         using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
         {
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            result = await command.ExecuteNonQueryAsync() > 0 ? true : false;
         }
         return result;
      }
      public void UpdateWithTransaction(string commandText, CommandType commandType, IDbDataParameter[] parameters)
      {
         IDbTransaction transactionScope = null;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            transactionScope = connection.BeginTransaction();

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               try
               {
                  command.ExecuteNonQuery();
                  transactionScope.Commit();
               }
               catch (Exception)
               {
                  transactionScope.Rollback();
               }
               finally
               {
                  connection.Close();
               }
            }
         }
      }
      public void UpdateWithTransaction(string commandText, CommandType commandType, IsolationLevel isolationLevel, IDbDataParameter[] parameters)
      {
         IDbTransaction transactionScope = null;
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            transactionScope = connection.BeginTransaction(isolationLevel);

            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }

               try
               {
                  command.ExecuteNonQuery();
                  transactionScope.Commit();
               }
               catch (Exception)
               {
                  transactionScope.Rollback();
               }
               finally
               {
                  connection.Close();
               }
            }
         }
      }
      public object GetScalarValue(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         using (var connection = database.CreateConnection())
         {
            connection.Open();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               return command.ExecuteScalar();
            }
         }
      }
      public async Task<object> GetScalarValueAsync(string commandText, CommandType commandType, IDbDataParameter[] parameters = null)
      {
         using (var connection = database.CreateConnection())
         {
            await connection.OpenAsync();
            using (var command = database.CreateCommand(commandText, commandType, connection))
            {
               if (parameters != null)
               {
                  foreach (var parameter in parameters)
                  {
                     command.Parameters.Add(parameter);
                  }
               }
               return await command.ExecuteScalarAsync();
            }
         }
      }
      public object GetScalarValue(string commandText, CommandType commandType, IDbTransaction transactionScope, IDbDataParameter[] parameters = null)
      {
         var connection = database.GetConnection();
         using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
         {
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            return command.ExecuteScalar();
         }
      }
      public async Task<object> GetScalarValueAsync(string commandText, CommandType commandType, IDbTransaction transactionScope, IDbDataParameter[] parameters = null)
      {
         var connection = database.GetConnection();
         using (var command = database.CreateCommand(commandText, commandType, connection, transactionScope))
         {
            if (parameters != null)
            {
               foreach (var parameter in parameters)
               {
                  command.Parameters.Add(parameter);
               }
            }
            return await command.ExecuteScalarAsync();
         }
      }
      public void LoadEntity(IDataReader reader, object x_esquema, Type temp)
      {
         try
         {
            int _campos = reader.FieldCount - 1;
            for (int _index = 0; _index <= _campos; _index++)
            {
               if (!reader.IsDBNull(_index))
               {
                  object _valor = reader.GetValue(_index);
                  string _campo = reader.GetName(_index);
                  PropertyInfo _propertInfo = null;
                  _propertInfo = temp.GetProperty(_campo);
                  if (!((_propertInfo == null)))
                  {
                     Type _tipoCampo = _propertInfo.PropertyType;
                     this.SetValueEntity(ref _propertInfo, _tipoCampo.ToString(), _valor, ref x_esquema);
                  }
               }
            }
         }
         catch (Exception ex)
         {
            throw ex;
         }
      }
      private void SetValueEntity(ref PropertyInfo x_propertInfo, string x_tipoCampo, object x_valor, ref object x_esquema)
      {
         if (x_valor != null)
         {
            switch (x_tipoCampo)
            {
               case "System.String":
                  x_propertInfo.SetValue(x_esquema, x_valor.ToString(), null);
                  break;
               case "System.Int16":
                  Int16 _value1;
                  if (Int16.TryParse(x_valor.ToString(), out _value1))
                  { x_propertInfo.SetValue(x_esquema, _value1, null); }
                  break;
               case "System.Nullable`1[System.Int16]":
                  Int16 _value2;
                  if (Int16.TryParse(x_valor.ToString(), out _value2))
                  { x_propertInfo.SetValue(x_esquema, _value2, null); }
                  break;
               case "System.Int32":
                  Int32 _value3;
                  if (Int32.TryParse(x_valor.ToString(), out _value3))
                  { x_propertInfo.SetValue(x_esquema, _value3, null); }
                  break;
               case "System.Nullable`1[System.Int32]":
                  Int32 _value4;
                  if (Int32.TryParse(x_valor.ToString(), out _value4))
                  { x_propertInfo.SetValue(x_esquema, _value4, null); }
                  break;
               case "System.Double":
                  Double _value5;
                  if (Double.TryParse(x_valor.ToString(), out _value5))
                  { x_propertInfo.SetValue(x_esquema, _value5, null); }
                  break;
               case "System.Nullable`1[System.Double]":
                  Double _value6;
                  if (Double.TryParse(x_valor.ToString(), out _value6))
                  { x_propertInfo.SetValue(x_esquema, _value6, null); }
                  break;
               case "System.Decimal":
                  Decimal _value7;
                  if (Decimal.TryParse(x_valor.ToString(), out _value7))
                  { x_propertInfo.SetValue(x_esquema, _value7, null); }
                  break;
               case "System.Nullable`1[System.Decimal]":
                  Decimal _value8;
                  if (Decimal.TryParse(x_valor.ToString(), out _value8))
                  { x_propertInfo.SetValue(x_esquema, _value8, null); }
                  break;
               case "System.DateTime":
                  DateTime _value9;
                  if (DateTime.TryParse(x_valor.ToString(), out _value9))
                  { x_propertInfo.SetValue(x_esquema, _value9, null); }
                  break;
               case "System.Nullable`1[System.DateTime]":
                  DateTime _value10;
                  if (DateTime.TryParse(x_valor.ToString(), out _value10))
                  { x_propertInfo.SetValue(x_esquema, _value10, null); }
                  break;
               case "System.Boolean":
                  Boolean _value11;
                  if (Boolean.TryParse(x_valor.ToString(), out _value11))
                  { x_propertInfo.SetValue(x_esquema, _value11, null); }
                  break;
               case "System.Nullable`1[System.Boolean]":
                  Boolean _value12;
                  if (Boolean.TryParse(x_valor.ToString(), out _value12))
                  { x_propertInfo.SetValue(x_esquema, _value12, null); }
                  break;
               case "System.Guid":
                  Guid _value13;
                  if ((Guid.TryParse(x_valor.ToString(), out _value13)))
                  { x_propertInfo.SetValue(x_esquema, _value13, null); }
                  break;
               case "System.Nullable`1[System.Guid]":
                  Guid _value14;
                  if ((Guid.TryParse(x_valor.ToString(), out _value14)))
                  { x_propertInfo.SetValue(x_esquema, _value14, null); }
                  break;
               case "System.Xml.XmlDocument":
                  try
                  {
                     XmlDocument _value15 = new XmlDocument();
                     _value15.LoadXml(x_valor.ToString());
                     x_propertInfo.SetValue(x_esquema, _value15, null);
                  }
                  catch (Exception)
                  { }
                  break;
               case "System.TimeSpan":
                  TimeSpan _value17;
                  if ((TimeSpan.TryParse(x_valor.ToString(), out _value17)))
                  { x_propertInfo.SetValue(x_esquema, _value17, null); }
                  break;
               case "System.Nullable`1[System.TimeSpan]":
                  TimeSpan _value18;
                  if ((TimeSpan.TryParse(x_valor.ToString(), out _value18)))
                  { x_propertInfo.SetValue(x_esquema, _value18, null); }
                  break;
               case "System.Byte[]":
                  if (x_valor != null)
                  { x_propertInfo.SetValue(x_esquema, (byte[])x_valor, null); }
                  break;
            }
         }
      }
   }
}
