using GrocerySharp.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface ICategoryRepository
    {
        Task<int> AddAsync(Category category);
        Task<Category> GetByIdAsync(int id);
        Task<List<Category>> GetAllAsync();
        Task UpdateAsync(Category category);
        Task DeleteAsync(int id);
    }
}
