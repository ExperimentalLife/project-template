using System;
using System.Collections.Generic;
using System.Text;

namespace Domain.Model.Constants
{
   public class ResponseConstants
   {
      public const string SUCCESSFULLY_MESSAGE = "Proceso satisfactoio";
      public const string ERROR_DEFAULT_MESSAGE = "Error de sistema";
      public const string ERROR_SESSION_MESSAGE = "Usuario invalido";
      public const string ERROR_AUTORIZACION_MESSAGE = "Su email o password es incorrecto";
      public const string ERROR_AUTORIZACION_SERVICE_MESSAGE = "El servicio de autenticacion fallo";
      public const string ERROR_EMAIL_MESSAGE = "El email es incorrecto";
      public const string ERROR_USER_MESSAGE = "Usuario no existe";
   }
}
