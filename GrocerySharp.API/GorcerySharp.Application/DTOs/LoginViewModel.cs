namespace GorcerySharp.Application.DTOs
{
    public class LoginViewModel
    {
        public LoginViewModel() { }

        public LoginViewModel(string token)
        {
            Token = token;
        }
        public string Token { get; set; }
    }
}
