using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    public class CategoryController : ControllerBase
    {
        private readonly GrocerySharpDbContext _context;

        public CategoryController(GrocerySharpDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(CategoryInputModel model)
        {
            var category = CategoryInputModel.ToEntity(model);

            _context.Categories.Add(category);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _context.Categories.ToListAsync();

            return Ok(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == id);
            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(CategoryInputModel model, int id)
        {
            var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == id);
            if (category == null)
                return NotFound();

            category.Update(model.Name);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _context.Categories.SingleOrDefaultAsync(x => x.Id == id);
            if (category == null)
                return NotFound();

            _context.Categories.Remove(category);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
