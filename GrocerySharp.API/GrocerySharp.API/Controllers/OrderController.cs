using GorcerySharp.Application.DTOs;
using GrocerySharp.Infra.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly GrocerySharpDbContext _context;

        public OrderController(GrocerySharpDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Post(OrderInputModel model)
        {
            var order = OrderInputModel.ToEntity(model);

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var oders = await _context.Orders.ToListAsync();

            return Ok(oders);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == id);
            if (order == null)
                return NotFound();

            return Ok(order);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(OrderInputModel model, int id)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == id);
            if(order == null)
                return NotFound();

            order.Update(model.UserId, model.OrderStatus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == id);
            if(order == null)
                return NotFound();

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
