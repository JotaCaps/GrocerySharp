import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../shared/validators";
import PasswordInput from "../components/PasswordInput";

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

  function validate() {
    const errs = [];
    const email = form.email.trim();

    if (!email) errs.push("Email é obrigatório.");
    else if (!isValidEmail(email)) errs.push("Email inválido (ex: email@dominio.com).");

    if (!form.password?.trim()) errs.push("Senha é obrigatória.");
    else if (form.password.length < 6) errs.push("Senha precisa ter no mínimo 6 caracteres.");

    return errs;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const errs = validate();
    if (errs.length) {
      setError(errs.join(" "));
      return;
    }

    try {
      // Chama PUT /api/auth/login — o token retornado é salvo pelo hook
      await login({ email: form.email.trim(), password: form.password });
      nav(redirect, { replace: true });
    } catch {
      // erro já foi setado no hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="text-sm text-gray-600 hover:underline">
            ← Voltar
          </Link>

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

          {isAdmin && (
            <p className="text-gray-500 mt-1 text-sm">
              Use as credenciais de um usuário com role <span className="font-mono">Admin</span>.
            </p>
          )}

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
              <PasswordInput
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
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

            {!isAdmin && (
              <div className="text-sm text-gray-600 text-center">
                Não tem conta?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Criar conta
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}