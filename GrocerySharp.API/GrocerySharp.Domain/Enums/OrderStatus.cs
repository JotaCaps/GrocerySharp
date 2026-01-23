using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Enums
{
    public enum OrderStatus
    {
        PaymentPending = 1,
        PaymentAproved = 2,
        Sipped = 3,
        Delivered = 4,
        Canceled = 5
    }
}
