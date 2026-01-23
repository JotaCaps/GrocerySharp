using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly GrocerySharpDbContext _context;

        public UserController(GrocerySharpDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserInputModel model)
        {
            var user = model.ToEntity();

            var role = await _context.Roles.FindAsync(model.RoleId);

            if (role != null)
                user.Roles.Add(role);

            else
                return BadRequest("Invalid RoleId");
            

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, GetUserByIdViewModel.FromEntity(user));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var model = await _context.Users
               .Include(r => r.Roles)
               .ToListAsync();

            var users = model.Select(GetAllUsersViewModel.FromEntity)
                .ToList();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users
                .Include(u => u.Roles)
                .SingleOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            var model = GetUserByIdViewModel.FromEntity(user);
            

            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(UserInputModel model, int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();

            user.Update(model.Name, model.Email, model.Phone, model.Password);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if(user == null)
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
