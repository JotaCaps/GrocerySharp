using GrocerySharp.Domain.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Payment
    {
        public int Id { get; private set; }
        public decimal Amount { get; private set; }
        public PaymentStatus Status { get; private set; }
        public DateTime CreatedAt { get; private set; }

        protected Payment() { }

        public Payment(decimal amount)
        {
            Amount = amount;
            Status = PaymentStatus.Pending;
            CreatedAt = DateTime.Now;
        }

        public void Confirm() => Status = PaymentStatus.Paid;
        public void Cancel() => Status = PaymentStatus.Cancelled;
    }
}
