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
            var user = UserInputModel.ToEntity(model);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _context.Users.ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == id);
            if (user == null)
                return NotFound();
            
            return Ok(user);
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
