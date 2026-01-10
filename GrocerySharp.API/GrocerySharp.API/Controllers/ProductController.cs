using Microsoft.AspNetCore.Mvc;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/products")]
    public class ProductController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            return Created();
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetById()
        {
            return Ok();
        }

        [HttpPut]
        public async Task<IActionResult> Update()
        {
            return NoContent();
        }

        [HttpDelete]
        public async Task<IActionResult> Delete()
        {
            return NoContent();
        }
    }
}
