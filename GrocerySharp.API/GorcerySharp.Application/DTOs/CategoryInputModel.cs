using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class CategoryInputModel
    {
        public string Name { get; set; }

        public static Category ToEntity(CategoryInputModel model)
            => new(model.Name);
    }
}
