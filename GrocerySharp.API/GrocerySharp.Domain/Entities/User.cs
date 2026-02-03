using GrocerySharp.Domain.Abstractions.Interfaces;

namespace GrocerySharp.Domain.Entities
{
    public class User : BaseEntity, ISoftDelete
    {
        public User() { }

        public User(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;

            Orders = new List<Order>();
            Roles = new List<Role>();
        }
        public string Name { get; private set; }
        public string Email { get; private set; }
        public string Phone { get; private set; }
        public string Password { get; private set; }
        public bool IsDeleted { get; set; }
        public DateTime? DeletedAt { get; set; }
        public List<Order> Orders { get; private set; }
        public List<Role> Roles { get; private set; }

        public void Update(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;
        }
    }
}
