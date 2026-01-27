using GrocerySharp.Domain.Entities;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface ICategoryRepository
    {
        Task<int> AddAsync();
        Task<int> GetByIdAsync(int id);
        Task GetAllAsync();
        Task UpdateAsync(Category category);
        Task DeleteAsync(int id);
    }
}
