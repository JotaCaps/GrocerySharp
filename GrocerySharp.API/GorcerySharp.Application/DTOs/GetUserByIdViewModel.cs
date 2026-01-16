using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class GetUserByIdViewModel
    {
        public GetUserByIdViewModel()
        {
            
        }
        public GetUserByIdViewModel(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;
        }
        
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }

        public List<string> Roles { get; set; } = new List<string>();

        public static GetUserByIdViewModel FromEntity(User model)
            => new GetUserByIdViewModel 
            { 
                Id = model.Id,
                Name = model.Name, 
                Email = model.Email, 
                Phone = model.Phone, 
                Password = model.Password,

                Roles = model.Roles?.Select(r => r.Name).ToList() ?? new List<string>()
            };
    }
}
