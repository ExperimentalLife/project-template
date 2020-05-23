using Domain.Model.Entities.Auth.Filters;
using FluentValidation;
using System.Globalization;

namespace Application.Validators.Auth
{
   public class AuthValidator: AbstractValidator<SignInFilter>
   {
      public AuthValidator()
      {
         ValidatorOptions.LanguageManager.Culture = new CultureInfo("es");
         RuleFor(x => x.Username).MaximumLength(20);
         RuleFor(x => x.Password).MaximumLength(20);

      }
   }
}
