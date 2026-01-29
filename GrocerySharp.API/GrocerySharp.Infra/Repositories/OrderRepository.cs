using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Infra.Repositories
{
    public class OrderRepository : IOrderRepository
    {
         private readonly GrocerySharpDbContext _context;

        public OrderRepository(GrocerySharpDbContext context)
        {
            _context = context;
        }

        public async Task<int> AddAsync(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order.Id;
        }

        public async Task<List<Order>> GetAllAsync()
        {
            return await _context.Orders.ToListAsync();
        }

        public async Task<Order> GetByIdAsync(int id)
        {
            return await _context.Orders.SingleOrDefaultAsync(o => o.Id == id);
        }

        public async Task<Order> GetByIdWithPaymentAsync(int id)
        {
            return await _context.Orders
                .Include(o => o.Payment)
                .SingleOrDefaultAsync(o => o.Id == id);
        }

        public async Task UpdateAsync(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(o => o.Id == id);
            if (order == null)
                return;

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
