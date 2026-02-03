using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class OrderItem
    {
        public Order Order { get; private set; }
        public int OrderId { get; private set; }
        public Product Product { get; private set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
