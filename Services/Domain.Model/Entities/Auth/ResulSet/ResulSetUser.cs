using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Model.Entities.Auth.ResulSet
{
   public class ResulSetUser
   {
      public string USER_id { get; set; }
      public string USER_username { get; set; }
      public string USER_password { get; set; }
      public string USER_firstName { get; set; }
      public string USER_lastName { get; set; }
      public string USER_name { get; set; }
      public string USER_photoUrl { get; set; }
   }
}
