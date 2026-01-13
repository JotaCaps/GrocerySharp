using GrocerySharp.Domain.Entities;
using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class OrderInputModel
    {
        public int UserId { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public static Order ToEntity(OrderInputModel model)
            => new Order(model.UserId, model.OrderStatus);

    }
}
