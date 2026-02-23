using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using GrocerySharp.Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/orders")]
    [Authorize(Roles = "Admin")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public OrderController(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Post(OrderInputModel model)
        {
            decimal totalOrderValue = 0;
            var orderItems = new List<OrderItem>();

            foreach (var item in model.Items)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product == null)
                    return BadRequest($"Product with ID {item.ProductId} not found.");

                totalOrderValue += product.Price * item.Quantity;

                orderItems.Add(new OrderItem
                {
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    Price = product.Price
                });
            }

            var order = new Order(model.UserId, OrderStatus.PaymentPending, totalOrderValue);
            order.OrderItens = orderItems;

            var id = await _orderRepository.AddAsync(order);

            return CreatedAtAction(nameof(GetById), new { id }, OrderViewModel.FromEntity(order));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _orderRepository.GetAllAsync();

            var model = orders.Select(OrderViewModel.FromEntity).ToList();

            return Ok(model);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            var model = OrderViewModel.FromEntity(order);
            return Ok(model);
        }

        [HttpPut("{id}")]
        
        public async Task<IActionResult> Update(OrderInputModel model, int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null)
                return NotFound();

            order.Update(model.UserId, model.OrderStatus);

            await _orderRepository.UpdateAsync(order);

            return NoContent();
        }

        [HttpPut("{id}/confirm-payment")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<IActionResult> ConfirmPayment(int id)
        {
            var order = await _orderRepository.GetByIdWithPaymentAsync(id);

            if (order == null)
                return NotFound($"Pedido com ID {id} não encontrado");

            if (order.Payment.Status != PaymentStatus.Pending)
                return BadRequest($"O pagamento já está com status: {order.Payment.Status}");

            order.Payment.Confirm();
            order.OrderStatus = OrderStatus.PaymentAproved;

            await _orderRepository.SaveChangesAsync();

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
            var order = await _orderRepository.GetByIdAsync(id);
            if(order == null)
                return NotFound();

            await _orderRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
