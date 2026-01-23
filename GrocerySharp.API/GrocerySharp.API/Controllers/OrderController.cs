using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Domain.Enums;
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
            decimal totalOrderValue = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in model.Items)
                {
                    var product = await _context.Products
                        .SingleOrDefaultAsync(p => p.Id == item.ProductId);
                    if (product == null)
                       return BadRequest($"Product with ID {item.ProductId} not found.");

                    totalOrderValue += product.Price * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price
                });
            };

            var order = new Order(model.UserId, OrderStatus.PaymentPending, totalOrderValue);
            order.OrderItens = orderItems;

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = order.Id }, OrderViewModel.FromEntity(order));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var oders = await _context.Orders.ToListAsync();

            var model = oders.Select(OrderViewModel.FromEntity)
                .ToList();

            return Ok(model);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _context.Orders.SingleOrDefaultAsync(x => x.Id == id);
            if (order == null)
                return NotFound();

            var model = OrderViewModel.FromEntity(order);

            return Ok(model);
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

        [HttpPut("{id}/confirm-payment")]
        public async Task<IActionResult> ConfirmPayment(int id)
        {
            var order = await _context.Orders
                .Include(o => o.Payment)
                .SingleOrDefaultAsync(o => o.Id == id);

            if(order == null)
                return NotFound($"Pedido com ID {order.Id} não encontrado");

            if(order.Payment.Status != PaymentStatus.Pending)
                return BadRequest($"O pagamento já está com status: {order.Payment.Status}");

            order.Payment.Confirm();
            order.OrderStatus = OrderStatus.PaymentAproved;

            await _context.SaveChangesAsync();

            return Ok(new PaymentStatusViewModel
            {
                OrderId = order.Id,
                NewOrderStatus = order.OrderStatus.ToString(),
                NewPaymentStatus = order.Payment.Status.ToString()
            });
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
