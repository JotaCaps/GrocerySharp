using FluentValidation;
using GorcerySharp.Application.DTOs;

public class ProductInputModelValidator : AbstractValidator<ProductInputModel>
{
    public ProductInputModelValidator()
    {
        RuleFor(p => p.Name)
            .NotEmpty().WithMessage("O nome do produto é obrigatório.")
            .Length(2, 100).WithMessage("O nome deve ter entre 2 e 100 caracteres.");

        RuleFor(p => p.Price)
            .GreaterThan(0).WithMessage("O preço deve ser maior que zero.");

        RuleFor(p => p.Description)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MinimumLength(10).WithMessage("A descrição deve ter pelo menos 10 caracteres.");
    }
}  

