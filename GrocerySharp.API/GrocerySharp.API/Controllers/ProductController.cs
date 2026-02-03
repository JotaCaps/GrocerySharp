using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Abstractions.Repositories;
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

        private readonly IProductRepository _productRepository;

        public ProductController(IProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Post(ProductInputModel model)
        {
            var product = model.ToEntity();

            var id = await _productRepository.AddAsync(product);

            return CreatedAtAction(nameof(GetById), new { id }, ProductViewModel.FromEntity(product));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _productRepository.GetAllAsync();

            var model = products.Select(ProductViewModel.FromEntity)
                .ToList();

            return Ok(model);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var model = await _productRepository.GetByIdAsync(id);
            if (model == null)
                return NotFound();

            var product = ProductViewModel.FromEntity(model);

            return Ok(product);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(ProductInputModel model, int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if (product == null)
                return NotFound();

            product.Update(model.Name, model.Description, model.Price, model.Img);
            await _productRepository.UpdateAsync(product);

            return NoContent();
        }

        [HttpDelete("{id}")] 
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepository.GetByIdAsync(id);
            if(product == null)
                return NotFound();

            await _productRepository.DeleteAsync(id);
            return NoContent(); 
        }
    }
}
