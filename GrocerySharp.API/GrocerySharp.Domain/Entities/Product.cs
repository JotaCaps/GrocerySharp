using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Product : BaseEntity
    {
        public Product() { }

        public Product(string name, string description, decimal price, string img)
        {
            Name = name;
            Description = description;
            Price = price;
            Img = img;
            Categories = new List<Category>();
            OrderItens = new List<OrderItem>();
        }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;

        public List<Category> Categories { get; set; }

        public List<OrderItem> OrderItens { get; set; }

        public void Update(string name, string description, decimal price, string img)
        {
            Name = name;
            Description = description;
            Price = price;
            Img = img;
        }
    }
}
