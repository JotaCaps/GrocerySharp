using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Order : BaseEntity
    {
        public Order() { }

        public Order(int userId, OrderStatus orderStatus)
        {
            UserId = userId;
            OrderDate = DateTime.UtcNow;
            OrderStatus = orderStatus;
        }

        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public List<OrderItem> OrderItens { get; set; }
    }
}
