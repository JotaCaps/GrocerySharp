using GrocerySharp.Domain.Abstractions.Interfaces;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Product : BaseEntity, ISoftDelete
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

        public string Name { get; private set; } = string.Empty;
        public string Description { get; private set; } = string.Empty;
        public decimal Price { get; private set; }
        public string Img { get; private set; } = string.Empty;
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }

        public List<Category> Categories { get; private set; }

        public List<OrderItem> OrderItens { get; private set; }

        public void Update(string name, string description, decimal price, string img)
        {
            Name = name;
            Description = description;
            Price = price;
            Img = img;
        }
    }
}
