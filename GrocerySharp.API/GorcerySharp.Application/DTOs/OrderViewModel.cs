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

        public OrderViewModel(int id, int userId, DateTime orderDate, OrderStatus orderStatus)
        {
            Id = id;
            UserId = userId;
            OrderDate = orderDate;
            OrderStatus = orderStatus;
        }
        public int Id { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public static OrderViewModel FromEntity(Order model)
            => new OrderViewModel
            {
                Id = model.Id,
                UserId = model.UserId,
                OrderDate = model.OrderDate,
                OrderStatus = model.OrderStatus
            };
    }
}
