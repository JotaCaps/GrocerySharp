using FluentValidation;
using GorcerySharp.Application.DTOs;

public class OrderInputModelValidator : AbstractValidator<OrderInputModel>
{
    public OrderInputModelValidator()
    {
        RuleFor(o => o.UserId)
            .NotEmpty().WithMessage("O ID do usuário é obrigatório.");

        RuleFor(o => o.Items)
            .NotEmpty().WithMessage("O pedido deve conter pelo menos um item.");

        RuleForEach(o => o.Items).SetValidator(new OrderItemInputModelValidator());
    }
}

public class OrderItemInputModelValidator : AbstractValidator<OrderItemInputModel>
{
    public OrderItemInputModelValidator()
    {
        RuleFor(i => i.ProductId)
            .NotEmpty().WithMessage("O ID do produto é obrigatório.");

        RuleFor(i => i.Quantity)
            .GreaterThan(0).WithMessage("A quantidade deve ser pelo menos 1.");
    }
}
