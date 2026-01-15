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
        public DbSet<Role> Roles { get; set; }

        public DbSet<OrderItem> OrderItens { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Role>().HasData(
                new Role { Id = 1, Name = "Admin" },
                new Role { Id = 2, Name = "Employee" },
                new Role { Id = 3, Name = "Customer" }
            );


            builder.Entity<User>()
                .HasMany(u => u.Roles)
                .WithMany(r => r.Users)
                .UsingEntity(j => j.ToTable("UserRoles"));


            builder.Entity<User>(e =>
            {              
                e.HasKey(e => e.Id);
                e.Property(u => u.Id).ValueGeneratedOnAdd();


                e.HasMany(e => e.Orders)
                .WithOne(o => o.User)
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            });

            builder.Entity<Role>(e => {
                e.HasKey(r => r.Id);
                e.Property(r => r.Id).ValueGeneratedOnAdd();
            });

            builder.Entity<Product>(e =>
            {
                e.HasKey(p => p.Id);
                e.Property(p => p.Id).ValueGeneratedOnAdd();


                e.HasMany(p => p.Categories)
                .WithMany(p => p.Products);
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
