using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GorcerySharp.Application.DTOs
{
    public class GetAllUsersViewModel
    {
        public GetAllUsersViewModel()
        {

        }
        public GetAllUsersViewModel(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
        }

        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public List<string> Roles { get; set; } = new List<string>();

        public static GetAllUsersViewModel FromEntity(User model)
            => new GetAllUsersViewModel
            {
                Id = model.Id,
                Name = model.Name,
                Email = model.Email,
                Phone = model.Phone,

                Roles = model.Roles?.Select(r => r.Name).ToList() ?? new List<string>()

            };
    }
}

