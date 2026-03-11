import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { clearToken } from "../services/authToken";

export default function Navbar() {
  const nav = useNavigate();
  const { name, email, roles } = useCurrentUser();

  function logout() {
    clearToken();
    nav("/login", { replace: true });
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">
        {/* Logo / Nome do sistema */}
        <span className="font-bold text-gray-800 text-lg tracking-tight">
          🛒 GrocerySharp
        </span>

        {/* Usuário + logout */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">
              Olá, <span className="text-gray-900 font-semibold">{name}</span>!
            </p>
            {roles.length > 0 && (
              <p className="text-xs text-gray-400">{roles.join(", ")}</p>
            )}
          </div>

          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-700 text-sm text-gray-600 transition"
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}