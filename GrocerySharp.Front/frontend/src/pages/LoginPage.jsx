import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function useQueryFlag(name) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name), [search]);
}

export default function LoginPage({ isAdmin = false }) {
  const nav = useNavigate();
  const { busy, error, setError, login } = useAuth();
  const redirect = useQueryFlag("redirect") || "/";

  const [form, setForm] = useState({ email: "", password: "" });

  function setField(name, value) {
    setError("");
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email e senha são obrigatórios.");
      return;
    }

    try {
      await login({ email: form.email.trim(), password: form.password, isAdmin });
      nav(redirect);
    } catch {
      // erro já foi setado no hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Voltar
          </Link>

          {/* Canto superior direito: login de admin */}
          {!isAdmin ? (
            <Link to="/admin/login" className="text-sm text-blue-600 hover:underline">
              Login Admin
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-blue-600 hover:underline">
              Login Usuário
            </Link>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isAdmin ? "Entrar como Admin" : "Entrar"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin
              ? "Área administrativa (JWT + roles depois)."
              : "Entre para gerenciar seu GrocerySharp."}
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="seuemail@exemplo.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {busy ? "Entrando…" : "Entrar"}
            </button>

            <div className="text-sm text-gray-600 text-center">
              Não tem conta?{" "}
              <Link to="/register" className="text-blue-600 hover:underline">
                Criar conta
              </Link>
            </div>

            {/* Gap futuro: esqueceu senha */}
            <div className="text-xs text-gray-400 text-center">
              {/* TODO: Implementar "Esqueci minha senha" quando houver endpoint */}
            </div>
          </form>

          {/* Mock help */}
          <div className="mt-5 text-xs text-gray-400">
            {!import.meta.env.VITE_USE_REAL_AUTH && (
              <div>
                Mock ativo: admin = <span className="font-mono">admin@admin.com</span> /{" "}
                <span className="font-mono">123</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}