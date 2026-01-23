using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Infra.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {

        private readonly GrocerySharpDbContext _context;

        public ProductController(GrocerySharpDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ProductInputModel model)
        {
            var product = model.ToEntity();

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, ProductViewModel.FromEntity(product));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products.ToListAsync();

            var model = products.Select(ProductViewModel.FromEntity)
                .ToList();

            return Ok(model);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);
            if (model == null)
                return NotFound();

            var product = ProductViewModel.FromEntity(model);

            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(ProductInputModel model, int id)
        {
            var product = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);
            if (product == null)
                return NotFound();

            product.Update(model.Name, model.Description, model.Price, model.Img);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")] 
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _context.Products.SingleOrDefaultAsync(x => x.Id == id);
            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
