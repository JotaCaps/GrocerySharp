using GorcerySharp.Application.DTOs;
using GrocerySharp.Domain.Abstractions.Repositories;
using GrocerySharp.Infra.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace GrocerySharp.API.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPut("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login(LoginInputModel model)
        {
            var hash = _authService.Computehash(model.Password);

            var user = _authService.GetUser(model.Email, hash);

            if (user == null)
                return Unauthorized("E-mail ou senha inválidos.");

            var roles = user.Roles.Select(r => r.Name).ToList();

            var token = _authService.GenerateToken(user.Email, roles);

            var viewModel = new LoginViewModel(token);

            return Ok(viewModel);
        }
    }
}
