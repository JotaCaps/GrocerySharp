using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class ProductViewModel
    {
        public ProductViewModel() { }

        public ProductViewModel(string name, string description, decimal price, string img)
        {
            Name = name;
            Description = description;
            Price = price;
            Img = img;
        }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;

        public ProductViewModel FromEntity()
            => new ProductViewModel(Name, Description, Price, Img);
    }
}
