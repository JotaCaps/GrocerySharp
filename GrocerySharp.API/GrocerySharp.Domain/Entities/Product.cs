using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Product : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;

        public List<Category> Categories { get; set; }

        public List<OrderItem> OrderItens { get; set; }
    }
}
