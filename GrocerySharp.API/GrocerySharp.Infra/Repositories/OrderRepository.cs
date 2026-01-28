using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Infra.Repositories
{
    public class OrderRepository : IOrderRepository /*Tava IProductRepository?*/
    {
        public Task<int> AddAsync()
        {
            throw new NotImplementedException();
        }

        public Task DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<int> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task UpdateAsync(Product product)
        {
            throw new NotImplementedException();
        }

        public Task UpdatePaymentStatusAsync(int Id)
        {
            throw new NotImplementedException();
        }
    }
}
