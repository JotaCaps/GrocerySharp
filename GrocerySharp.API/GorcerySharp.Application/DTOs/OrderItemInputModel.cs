using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public sealed record OrderItemInputModel
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        public void ToEntity()
            => new OrderItem
            {
                ProductId = ProductId,
                Quantity = Quantity,
                Price = Price
            };
    }
}
