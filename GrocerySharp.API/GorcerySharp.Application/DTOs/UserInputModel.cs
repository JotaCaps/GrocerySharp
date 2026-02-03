using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public sealed record UserInputModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

        public int RoleId { get; set; }

        public User ToEntity()
            => new User(Name, Email, Phone, Password);
    }
}
