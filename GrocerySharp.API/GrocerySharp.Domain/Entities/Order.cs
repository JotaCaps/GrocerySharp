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

            OrderItens = new List<OrderItem>();
        }

        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public List<OrderItem> OrderItens { get; set; }

        public void Update(int userId, OrderStatus orderStatus)
        {
            UserId = userId;
            OrderStatus = orderStatus;
        }
    }
}
