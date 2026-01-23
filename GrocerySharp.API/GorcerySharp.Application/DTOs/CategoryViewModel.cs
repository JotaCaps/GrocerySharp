using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class CategoryViewModel
    {
        public CategoryViewModel() { }

        public CategoryViewModel(int id, string name)
        {
            Id = id;
            Name = name;
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public static CategoryViewModel FromEntity(Category model)
            => new CategoryViewModel(model.Id, model.Name);
    }
}
