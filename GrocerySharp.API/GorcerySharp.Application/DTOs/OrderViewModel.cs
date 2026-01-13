using GrocerySharp.Domain.Entities;
using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class OrderViewModel
    {
        public OrderViewModel() { }

        public OrderViewModel(int userId, DateTime orderDate, OrderStatus orderStatus)
        {
            UserId = userId;
            OrderDate = orderDate;
            OrderStatus = orderStatus;
        }

        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public OrderViewModel FromEntity(Order model)
            => new OrderViewModel
            {
                UserId = model.UserId,
                OrderDate = model.OrderDate,
                OrderStatus = model.OrderStatus
            };
    }
}
