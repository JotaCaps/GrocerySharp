using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

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
            if (string.IsNullOrWhiteSpace(password))
                return string.Empty;

            using var sha256 = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hashBytes = sha256.ComputeHash(bytes);

            return Convert.ToHexString(hashBytes); 
        }

        public string GenerateToken(string email, IEnumerable<string> roles)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email inválido para gerar token.", nameof(email));

            var jwtSection = _configuration.GetSection("Jwt");

            var issuer = jwtSection["Issuer"];
            var audience = jwtSection["Audience"];
            var key = jwtSection["Key"];
            var expiresMinutesStr = jwtSection["ExpiresMinutes"];

            if (string.IsNullOrWhiteSpace(key) || key.Length < 32)
                throw new InvalidOperationException("Jwt:Key precisa ter pelo menos 32 caracteres.");

            _ = int.TryParse(expiresMinutesStr, out var expiresMinutes);
            if (expiresMinutes <= 0) expiresMinutes = 60;

            var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var credentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, email),
                new(JwtRegisteredClaimNames.Email, email),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new(ClaimTypes.Name, email)
            };

            if (roles != null)
            {
                foreach (var role in roles.Where(r => !string.IsNullOrWhiteSpace(r)))
                    claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                notBefore: DateTime.UtcNow,
                expires: DateTime.UtcNow.AddMinutes(expiresMinutes),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public User? GetUser(string Email, string hash)
        {
            return _context.Users
                .Include(u => u.Roles)
                .FirstOrDefault(u => u.Email == Email && u.Password == hash);
        }
    }
}
