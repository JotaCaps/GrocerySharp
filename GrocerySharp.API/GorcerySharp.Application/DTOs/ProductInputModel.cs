using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class ProductInputModel
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Img { get; set; } = string.Empty;

        public static Product ToEntity(ProductInputModel model)
            => new Product(model.Name, model.Description, model.Price, model.Img);
    }
}
