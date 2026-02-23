using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Abstractions.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/categories")]
    [Authorize(Roles = "Admin")]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Post(CategoryInputModel model)
        {
            var category = model.ToEntity();

            var id = await _categoryRepository.AddAsync(category);

            return CreatedAtAction(nameof(GetById), new { id }, CategoryViewModel.FromEntity(category));
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _categoryRepository.GetAllAsync();

            var model = categories.Select(CategoryViewModel.FromEntity).ToList();

            return Ok(model);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetById(int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            var model = CategoryViewModel.FromEntity(category);

            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(CategoryInputModel model, int id)
        {
            var category = await _categoryRepository.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            category.Update(model.Name);

            await _categoryRepository.UpdateAsync(category);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {   
            var category = await _categoryRepository.GetByIdAsync(id);
            if(category == null)
            {
                return NotFound();
            }

            await _categoryRepository.DeleteAsync(id);
            return NoContent();
        }
    }
}
