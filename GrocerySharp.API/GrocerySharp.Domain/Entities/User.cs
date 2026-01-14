namespace GrocerySharp.Domain.Entities
{
    public class User : BaseEntity
    {
        public User() { }

        public User(string Name, string Email, string Phone, string Password)
        {
            Name = Name;
            Email = Email;
            Phone = Phone;
            Password = Password;

            Orders = new List<Order>();
        }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public List<Order> Orders { get; set; }

        public void Update(string name, string email, string phone, string password)
        {
            Name = name;
            Email = email;
            Phone = phone;
            Password = password;
        }
    }
}
