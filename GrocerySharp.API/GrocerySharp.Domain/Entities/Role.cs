using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Entities
{
    public class Role : BaseEntity
    {
        public Role() { }

        public Role(string name)
        {
            Name = name;
            Users = new List<User>();
        }
        public string Name { get; set; }
        public List<User> Users { get; private set; }
    }
}
