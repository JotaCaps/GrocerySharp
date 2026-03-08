import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  formatPhoneBR,
  isValidEmail,
  isValidPhoneBR,
  passwordHasRecommendedStrength,
} from "../shared/validators";
import PasswordInput from "../components/PasswordInput";

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
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const pw = form.password || "";

    if (!name) errs.push("Nome é obrigatório.");
    else if (name.length < 3) errs.push("Nome precisa ter no mínimo 3 caracteres.");
    else if (name.length > 100) errs.push("Nome pode ter no máximo 100 caracteres.");

    if (!email) errs.push("Email é obrigatório.");
    else if (!isValidEmail(email)) errs.push("Email inválido (ex: email@dominio.com).");

    if (!phone) errs.push("Telefone é obrigatório.");
    else if (!isValidPhoneBR(phone)) errs.push("Telefone inválido. Use (XX) XXXXX-XXXX.");

    if (!pw.trim()) errs.push("Senha é obrigatória.");
    else if (pw.length < 8) errs.push("Senha precisa ter no mínimo 8 caracteres.");
    else if (!passwordHasRecommendedStrength(pw))
      errs.push("Senha fraca. Use pelo menos 1 maiúscula, 1 número e 1 símbolo.");

    if (pw !== form.confirmPassword) errs.push("Senhas não conferem.");

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
      // roleId NÃO é passado aqui — authService sempre envia Customer (3)
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      nav("/login", { replace: true });
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
          <p className="text-gray-500 mt-1">Cadastro como cliente.</p>

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
                autoComplete="email"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", formatPhoneBR(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="(11) 99999-9999"
                autoComplete="tel"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <PasswordInput
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                autoComplete="new-password"
                placeholder="Mín. 8 caracteres"
              />
              <div className="text-xs text-gray-400">
                Mín. 8 caracteres (recomendado: 1 maiúscula, 1 número e 1 símbolo).
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirmar senha</label>
              <PasswordInput
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                autoComplete="new-password"
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
        </div>
      </div>
    </div>
  );
}