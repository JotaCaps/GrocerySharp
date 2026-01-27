using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface IUserRepository
    {
        Task<int> AddAsync(User user);
        Task<User> GetByIdAsync(int id);
        Task<List<User>> GetAllAsync();
        Task UpdateAsync(User user);
        Task DeleteAsync(int id);
    }
}
