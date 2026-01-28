using GorcerySharp.Application.DTOs;
        using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userRepository;
        private readonly IRoleRepository _roleRepository;

        public UserController(IUserRepository userRepository, IRoleRepository roleRepository)
        {
            _userRepository = userRepository;
            _roleRepository = roleRepository;
        }

        [HttpPost]
        public async Task<IActionResult> Post(UserInputModel model)
        {
            var user = model.ToEntity();

            var role = await _roleRepository.GetRoleId(model.RoleId);
            if (role == null)
                return BadRequest("Invalid RoleId");

            user.Roles.Add(role);

            var id = await _userRepository.AddAsync(user);

            return CreatedAtAction(nameof(GetById), new { id }, GetUserByIdViewModel.FromEntity(user));
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var users = await _userRepository.GetAllAsync();
            var result = users.Select(GetAllUsersViewModel.FromEntity).ToList();

            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            return Ok(GetUserByIdViewModel.FromEntity(user));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(UserInputModel model, int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Update(model.Name, model.Email, model.Phone, model.Password);

            await _userRepository.UpdateAsync(user);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null)
                return NotFound();
                
            await _userRepository.DeleteAsync(id);
            return NoContent(); 
        }
    }
}
