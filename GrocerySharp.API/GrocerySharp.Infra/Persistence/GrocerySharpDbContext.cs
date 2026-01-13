using GrocerySharp.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Infra.Persistence
{
    public class GrocerySharpDbContext : DbContext
    {
        public GrocerySharpDbContext(DbContextOptions<GrocerySharpDbContext> options) : base(options)
        {
        }

        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<User> Users { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>(e =>
            {
                e.HasKey(e => e.Id);
                e.Property(u => u.Id).ValueGeneratedOnAdd();


                e.HasMany(o => o.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            });

            builder.Entity<Product>(e =>
            {
                e.HasKey(e => e.Id);
                e.Property(u => u.Id).ValueGeneratedOnAdd();


                e.HasMany(o => o.Categories)
                .WithMany(o => o.Products);
            });


            builder.Entity<OrderItem>(e =>
            {
                e.HasKey(e => new { e.OrderId, e.ProductId });

                e.HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItens)
                .HasForeignKey(oi => oi.OrderId);

                e.HasOne(oi => oi.Product)
                .WithMany(p => p.OrderItens)
                .HasForeignKey(oi => oi.ProductId);
            });


            builder.Entity<Order>(e =>
            {
                e.HasKey(e => e.Id);
                e.HasMany(o => o.OrderItens);
            });


        }
    }
}
