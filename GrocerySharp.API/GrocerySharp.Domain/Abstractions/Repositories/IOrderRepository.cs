using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface IOrderRepository
    {
        Task<int> AddAsync(Order order);
        Task<List<Order>> GetAllAsync();
        Task<Order> GetByIdAsync(int id);
        Task UpdateAsync(Order order);
        Task DeleteAsync(int id);

        Task<Order> GetByIdWithPaymentAsync(int id);
        Task SaveChangesAsync();
    }
}
