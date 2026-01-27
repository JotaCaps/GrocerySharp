using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface IOrderRepository
    {
        Task<int> AddAsync();
        Task<int> GetByIdAsync(int id);
        Task GetAllAsync();
        Task UpdatePaymentStatusAsync(int Id);
        Task UpdateAsync(Product product);
        Task DeleteAsync(int id);
    }
}
