using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Model.Entities.Auth.Entity
{
   public class AuthModel
   {
      public string idUser { get; set; }
      public string email { get; set; }
      public string firstName { get; set; }
      public string lastName { get; set; }
      public string name { get; set; }
      public string photoUrl { get; set; }
   }
}
