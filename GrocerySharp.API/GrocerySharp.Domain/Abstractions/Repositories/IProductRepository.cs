using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface IProductRepository
    {
        Task<int> AddAsync(Product product);
        Task<Product> GetByIdAsync(int id);
        Task<List<Product>> GetAllAsync();
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
