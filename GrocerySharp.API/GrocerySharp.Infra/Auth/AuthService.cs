using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace GrocerySharp.Infra.Auth
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _configuration;
        private readonly GrocerySharpDbContext _context;
        public AuthService(IConfiguration configuration, GrocerySharpDbContext context)
        {
            _configuration = configuration;
            _context = context;
        }
        public string Computehash(string password)
        {
            throw new NotImplementedException();
        }

        public string GenerateToken(string email, IEnumerable<string> roles)
        {
            throw new NotImplementedException();
        }

        public User? GetUser(string Email, string hash)
        {
            return _context.Users
                .Include(u => u.Roles)
                .FirstOrDefault(u => u.Email == Email && u.Password == hash);
        }
    }
}
