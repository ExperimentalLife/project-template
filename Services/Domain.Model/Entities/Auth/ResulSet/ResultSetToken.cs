using System;

namespace Domain.Model.Entities.Auth.ResulSet
{
   public class ResultSetToken
   {
      public string authToken { get; set; }
      public string email { get; set; }
      public string firstName { get; set; }
      public string id { get; set; }
      public string idToken { get; set; }
      public string lastName { get; set; }
      public string name { get; set; }
      public string photoUrl { get; set; }
      public string provider { get; set; }
      public DateTime fecha_expiracion { get; set; }
   }
}
