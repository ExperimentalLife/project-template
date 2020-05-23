using System;
using System.Collections.Generic;
using System.Net;
using System.Security.Principal;

namespace Domian.Common.Common
{
   public static class Common
   {
      public static string GetUserPC()
      {
         WindowsIdentity currentUser = WindowsIdentity.GetCurrent();
         return currentUser.User.Value;
      }
      public static string GetIPV4()
      {
         IPAddress[] direcciones = Dns.GetHostAddresses(Dns.GetHostName());
         string strIpPc = "";
         foreach (IPAddress ip in direcciones)
         {
            if (ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
            {
               strIpPc = ip.ToString();
               break;
            }
         }
         return strIpPc;
      }
      public static string GetHostName()
      {
         string hostName = Dns.GetHostName();
         return hostName;
      }

      public static string FormatSize(Int64 bytes)
      {
         string[] suffixes = { "Bytes", "KB", "MB", "GB", "TB", "PB" };
         int counter = 0;
         decimal number = (decimal)bytes;
         while (Math.Round(number / 1024) >= 1)
         {
            number = number / 1024;
            counter++;
         }
         return string.Format("{0:n1}{1}", number, suffixes[counter]);
      }

      public static DateTime FormatDuracion(double duracion)
      {
         var timeSpan = TimeSpan.FromMinutes(duracion);

         int hh = timeSpan.Hours;
         int mm = timeSpan.Minutes;
         int ss = timeSpan.Seconds;

         var StartTime = new DateTime(1753, 1, 1, hh, mm, ss);

         return StartTime;
      }

      public static string ToCustomString(this TimeSpan span)
      {
         return string.Format("{0:00}:{1:00}:{2:00}", span.Hours, span.Minutes, span.Seconds);
      }
      public static IEnumerable<T> Add<T>(this IEnumerable<T> e, T value)
      {
         foreach (var cur in e)
         {
            yield return cur;
         }
         yield return value;
      }
   }
}
