using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.Infra.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly GrocerySharpDbContext _context;

        public UserRepository(GrocerySharpDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user.Id;
        }

        public async Task DeleteAsync(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task<List<User>> GetAllAsync()
        {
            var model = await _context.Users
                .Include(r => r.Roles)
                .ToListAsync();

            return model;
        }

        public async Task<User> GetByIdAsync(int id)
        {
            var user = await _context.Users
                .Include(u => u.Roles)
                .SingleOrDefaultAsync(x => x.Id == id);

            return user;
        }

        public async Task UpdateAsync(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }
    }
}
