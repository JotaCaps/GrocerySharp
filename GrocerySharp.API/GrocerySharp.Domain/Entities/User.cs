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
        }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Password { get; set; }
        public List<Order> Orders { get; set; }
    }
}
