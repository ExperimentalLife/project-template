using System;
using System.Collections.Generic;
using System.Text;

namespace Application.Response
{
   public enum ResultType
   {
      Ok,
      Invalid,
      Unauthorized,
      PartialOk,
      NotFound,
      PermissionDenied,
      Unexpected
   }
   public abstract class Result<T>
   {
      public abstract ResultType ResultType { get; }
      public abstract List<string> Errors { get; }
      public abstract T Data { get; }
      public abstract DateTime Date { get; }
      public abstract Exception exception { get; }
   }
}
