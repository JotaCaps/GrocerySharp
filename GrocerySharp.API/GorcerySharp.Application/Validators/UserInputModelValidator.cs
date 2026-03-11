using FluentValidation;
using GorcerySharp.Application.DTOs;
using System.Text.RegularExpressions;

public class UserInputModelValidator : AbstractValidator<UserInputModel>
{
    public UserInputModelValidator()
    {
        RuleFor(u => u.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .Length(3, 100).WithMessage("O nome deve ter entre 3 e 100 caracteres.");

        RuleFor(u => u.Email)
            .NotEmpty().WithMessage("O e-mail é obrigatório.")
            .EmailAddress().WithMessage("Informe um e-mail válido.");

        RuleFor(u => u.Phone)
            .NotEmpty().WithMessage("O telefone é obrigatório.")
            .Matches(@"^\(?[1-9]{2}\)? ?9[0-9]{4}-?[0-9]{4}$")
            .WithMessage("O telefone deve estar no formato (XX) 9XXXX-XXXX.");

        RuleFor(u => u.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(8).WithMessage("A senha deve ter no mínimo 8 caracteres.")
            .Must(HasValidPassword).WithMessage("A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.");

        RuleFor(u => u.RoleId)
            .GreaterThan(0).WithMessage("Selecione um perfil de acesso válido.");
    }

    private bool HasValidPassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password)) return false;

        var regex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$");
        return regex.IsMatch(password);
    }
}
