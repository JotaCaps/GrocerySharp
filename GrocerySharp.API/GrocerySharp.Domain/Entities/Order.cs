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

        public User User { get; private set; }
        public int UserId { get; private set; }
        public DateTime OrderDate { get; private set; }
        public OrderStatus OrderStatus { get; set; }

        public int PaymentId { get; private set; }
        public Payment Payment { get; private set; }
        public decimal TotalAmount { get; private set; }

        public List<OrderItem> OrderItens { get; set; }

        public void Update(int userId, OrderStatus orderStatus)
        {
            UserId = userId;
            OrderStatus = orderStatus;
        }
    }
}
