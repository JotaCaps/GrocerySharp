using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class OrderItem
    {
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
