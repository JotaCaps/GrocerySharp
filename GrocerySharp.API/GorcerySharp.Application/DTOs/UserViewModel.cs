using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class UserViewModel
    {
        public UserViewModel()
        {
            
        }
        public UserViewModel(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;
        }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

        public UserViewModel FromEntity(User model)
            => new UserViewModel 
            { 
                Name = model.Name, 
                Email = model.Email, 
                Phone = model.Phone, 
                Password = model.Password 
            };
    }
}
