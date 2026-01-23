using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class ProductViewModel
    {
        public ProductViewModel() { }

        public ProductViewModel(int id, string name, string description, decimal price, string img)
        {
            Id = id;
            Name = name;
            Description = description;
            Price = price;
            Img = img;
        }
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;

        public static ProductViewModel FromEntity(Product model)
            => new ProductViewModel(model.Id, model.Name, model.Description, model.Price, model.Img);
    }
}
