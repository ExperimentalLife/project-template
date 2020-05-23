using System;
using System.Collections.Generic;

namespace Application.Response
{
   public class InvalidResult<T> : Result<T>
   {
      private string _error;
      private List<string> _errores = null;
      private Exception _exception = null;
      public InvalidResult(string error)
      {
         _error = error;
      }
      public InvalidResult(List<string> errores)
      {
         _errores = errores;
      }
      public InvalidResult(Exception exception)
      {
         _exception = exception;
         _error = exception.Message;
      }
      public override ResultType ResultType => ResultType.Invalid;
      public override List<string> Errors => _errores != null ? _errores : new List<string> { _error ?? "Ingreso invalido" };

      public override DateTime Date => DateTime.Now;
      public override T Data => default(T);
      public override Exception exception => _exception;
   }
}
