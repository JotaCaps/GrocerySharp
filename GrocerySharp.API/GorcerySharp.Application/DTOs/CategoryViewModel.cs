using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class CategoryViewModel
    {
        public CategoryViewModel() { }

        public CategoryViewModel(string name)
        {
            Name = name;
        }

        public string Name { get; set; }

        public CategoryViewModel FromEntity(Category model)
            => new CategoryViewModel(Name);
    }
}
