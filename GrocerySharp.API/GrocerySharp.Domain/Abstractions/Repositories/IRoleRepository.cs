using GrocerySharp.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace GrocerySharp.Domain.Abstractions.Repositories
{
    public interface IRoleRepository
    {
        Task<Role> GetRoleId(int id);
    }
}
