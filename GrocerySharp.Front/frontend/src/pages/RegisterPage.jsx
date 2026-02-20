import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function RegisterPage() {
  const nav = useNavigate();
  const { busy, error, setError, register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  function setField(name, value) {
    setError("");
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validate() {
    const errs = [];
    if (!form.name.trim()) errs.push("Nome é obrigatório.");
    if (!form.email.trim()) errs.push("Email é obrigatório.");
    if (!form.phone.trim()) errs.push("Telefone é obrigatório.");
    if (!form.password.trim()) errs.push("Senha é obrigatória.");
    if (form.password && form.password.length < 3) errs.push("Senha muito curta (mín 3 no mock).");
    if (form.password !== form.confirmPassword) errs.push("Senhas não conferem.");
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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      // Gap: se backend devolver token no register, você já pode setar token e logar direto
      nav("/login");
    } catch {
      // erro já foi setado no hook
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <Link to="/login" className="text-sm text-gray-600 hover:underline">
            ← Voltar pro login
          </Link>
          <Link to="/admin/login" className="text-sm text-blue-600 hover:underline">
            Login Admin
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-500 mt-1">Cadastro simples pra começar.</p>

          {error && (
            <div className="mt-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="mt-4 space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nome</label>
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="Seu nome"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="(11) 99999-9999"
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
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
            >
              {busy ? "Criando…" : "Criar conta"}
            </button>

            <div className="text-sm text-gray-600 text-center">
              Já tem conta?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Entrar
              </Link>
            </div>
          </form>

          <div className="mt-4 text-xs text-gray-400">
            {/* TODO: Quando houver roles no cadastro, permitir escolher role ou fixar Customer */}
            {/* TODO: Se backend devolver token aqui, pode logar automaticamente */}
          </div>
        </div>
      </div>
    </div>
  );
}