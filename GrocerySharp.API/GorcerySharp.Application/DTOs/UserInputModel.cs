using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class UserInputModel
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

        public int RoleId { get; set; }

        public static User ToEntity(UserInputModel model)
            => new User(model.Name, model.Email, model.Phone, model.Password);
    }
}
