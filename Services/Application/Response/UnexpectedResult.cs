using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Response
{
   public class UnexpectedResult<T> : Result<T>
   {
      private string _error;
      private string _StackTrace;
      private Exception _exception = null;
      public UnexpectedResult(Exception exception)
      {
         _error = exception.Message;
         _StackTrace = exception.StackTrace;
         _exception = exception;
      }
      public override ResultType ResultType => ResultType.Unexpected;
      public override List<string> Errors => new List<string> { _error ?? "Problema en la excepción" };
      public override T Data => default(T);
      public override DateTime Date => DateTime.Now;
      public override Exception exception => _exception;
   }
}
