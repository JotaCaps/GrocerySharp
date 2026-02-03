using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public sealed record CategoryInputModel
    {
        public string Name { get; set; }

        public Category ToEntity()
            => new(Name);
    }
}
