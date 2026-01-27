using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.Infra.Repositories
{
    public class RoleRepository : IRoleRepository
    {
        private readonly GrocerySharpDbContext _context;

        public RoleRepository(GrocerySharpDbContext context)
        {
            _context = context;
        }

        public async Task<Role> GetRoleId(int id)
        {
            return await _context.Roles.SingleOrDefaultAsync(x => x.Id == id);
        }
    }
}
