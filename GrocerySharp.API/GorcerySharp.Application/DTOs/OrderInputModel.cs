using GrocerySharp.Domain.Entities;
using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public sealed record OrderInputModel
    {
        public int UserId { get; set; }
        public List<OrderItemInputModel> Items { get; set; }

        public OrderStatus OrderStatus { get; set; }

        public Order ToEntity(decimal totalAmount)
            => new Order(UserId, OrderStatus.PaymentPending, totalAmount);

    }
}
