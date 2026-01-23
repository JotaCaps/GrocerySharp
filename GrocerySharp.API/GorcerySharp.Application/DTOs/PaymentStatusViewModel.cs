using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class PaymentStatusViewModel
    {
        public int OrderId { get; set; }
        public string NewOrderStatus { get; set; }
        public string NewPaymentStatus { get; set; }
    }
}
