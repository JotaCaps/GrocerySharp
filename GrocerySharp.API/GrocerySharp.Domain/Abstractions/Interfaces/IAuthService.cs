using GrocerySharp.Domain.Entities;

namespace GrocerySharp.Infra.Auth
{
    public interface IAuthService
    {
        string Computehash(string password);
        string GenerateToken(string email, IEnumerable<string> roles);
        User GetUser(string Email, string hash);
    }
}
