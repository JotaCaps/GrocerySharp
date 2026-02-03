using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Category : BaseEntity
    {
        public Category() { }

        public Category(string name)
        {
            Name = name;
            Products = new List<Product>();
        }

        public string Name { get; private set; }
        public List<Product> Products { get; private set; }

        public void Update(string name)
        {
            Name = name;
        }
    }
}
