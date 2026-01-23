using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Order : BaseEntity
    {
        public Order() { }

        public Order(int userId, OrderStatus orderStatus, decimal totalAmount)
        {
            UserId = userId;
            OrderDate = DateTime.UtcNow;
            OrderStatus = orderStatus;
            TotalAmount = totalAmount;


            OrderItens = new List<OrderItem>();

            Payment = new Payment(totalAmount);
        }

        public User User { get; set; }
        public int UserId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus OrderStatus { get; set; }

        public int PaymentId { get; set; }
        public Payment Payment { get; set; }
        public decimal TotalAmount { get; set; }

        public List<OrderItem> OrderItens { get; set; }

        public void Update(int userId, OrderStatus orderStatus)
        {
            UserId = userId;
            OrderStatus = orderStatus;
        }
    }
}
