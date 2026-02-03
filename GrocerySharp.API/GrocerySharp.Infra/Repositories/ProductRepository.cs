using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Infra.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly GrocerySharpDbContext _context;

        public ProductRepository(GrocerySharpDbContext context)
        {
            _context = context;
        }
        public async Task<int> AddAsync(Product product)
        {
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return product.Id;
        }

        public async Task DeleteAsync(int id)
        {
            var product = await _context.Products.SingleOrDefaultAsync(p => p.Id == id);
            if(product == null)
            {
                return;
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Product>> GetAllAsync()
        {
            var model = await _context.Products
                .ToListAsync();
            return model;
        }

        public async Task<Product> GetByIdAsync(int id)
        {
            var product = await _context.Products
                .SingleOrDefaultAsync(p => p.Id == id);
            
            return product;
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Products.Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
