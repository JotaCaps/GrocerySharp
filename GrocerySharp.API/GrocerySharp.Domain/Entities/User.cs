namespace GrocerySharp.Domain.Entities
{
    public class User : BaseEntity
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
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public List<Order> Orders { get; set; }
        public List<Role> Roles { get; set; }

        public void Update(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;
        }
    }
}
