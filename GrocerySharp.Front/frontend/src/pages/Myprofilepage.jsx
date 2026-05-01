// Customer: vê e edita APENAS o próprio usuário
// GET /api/users/{id} e PUT /api/users/{id} — o backend exige Admin,Employee para isso
// ATENÇÃO: o backend atual não tem endpoint "GET /api/users/me" nem permite Customer editar a si.
// Esta página usa os endpoints existentes e exibirá 403 se o backend não permitir.
// Para funcionar 100%, adicione no backend: GET /api/users/me e PUT /api/users/me (Customer).
// Por ora, a página mostra os dados do JWT e direciona para RegisterPage para alteração.
import { Link } from "react-router-dom";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useState } from "react";
import { api } from "../services/api";
import { extractApiError } from "../shared/apiErrors";
import PasswordInput from "../components/PasswordInput";
import { formatPhoneBR, isValidEmail, isValidPhoneBR, passwordHasRecommendedStrength } from "../shared/validators";

export default function MyProfilePage() {
  const { name, email } = useCurrentUser();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({ name: "", phone: "", password: "", confirmPassword: "" });

  function startEdit() {
    setForm({ name: name || "", phone: "", password: "", confirmPassword: "" });
    setEditing(true);
    setError("");
    setSuccess("");
  }

  function setField(field, value) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  function validate() {
    const errs = [];
    const n = form.name.trim();
    if (!n) errs.push("Nome é obrigatório.");
    else if (n.length < 3) errs.push("Nome precisa ter no mínimo 3 caracteres.");

    if (form.phone.trim() && !isValidPhoneBR(form.phone)) errs.push("Telefone inválido. Use (XX) XXXXX-XXXX.");

    if (form.password.trim()) {
      if (form.password.length < 8) errs.push("Senha precisa ter no mínimo 8 caracteres.");
      else if (!passwordHasRecommendedStrength(form.password)) errs.push("Senha fraca. Use 1 maiúscula, 1 número e 1 símbolo.");
      if (form.password !== form.confirmPassword) errs.push("Senhas não conferem.");
    }
    return errs;
  }

  // NOTE: O backend atual não expõe um endpoint "me" para Customer.
  // Esta função tenta PUT /api/users/me (não existe ainda) e informa o usuário.
  async function submit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    const errs = validate();
    if (errs.length) { setError(errs.join(" ")); return; }

    setBusy(true);
    try {
      // Endpoint futuro: PUT /api/users/me
      const payload = { name: form.name.trim() };
      if (form.phone.trim()) payload.phone = form.phone.trim();
      if (form.password.trim()) payload.password = form.password;
      await api.put("/api/users/me", payload);
      setSuccess("Perfil atualizado com sucesso!");
      setEditing(false);
    } catch (err) {
      const msg = extractApiError(err) || err?.message || "";
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        setError("O backend ainda não suporta edição do próprio perfil (endpoint /api/users/me não implementado). Entre em contato com o administrador.");
      } else {
        setError(msg || "Falha ao atualizar perfil.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Meu Perfil</h1>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
        {/* Dados do JWT */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="text-sm text-gray-500 mb-1">Email (login)</div>
          <div className="font-semibold text-gray-800">{email ?? "—"}</div>
        </div>

        {success && (
          <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700">{success}</div>
        )}
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>
        )}

        {!editing ? (
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Para atualizar seus dados, clique em editar.</p>
            <button onClick={startEdit} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">
              Editar perfil
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
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
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <input
                value={form.phone}
                onChange={(e) => setField("phone", formatPhoneBR(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Nova senha (opcional)</label>
              <PasswordInput value={form.password} onChange={(e) => setField("password", e.target.value)} autoComplete="new-password" placeholder="Deixe em branco para não alterar" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Confirmar nova senha</label>
              <PasswordInput value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} autoComplete="new-password" />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => { setEditing(false); setError(""); }} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100">Cancelar</button>
              <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60">{busy ? "Salvando…" : "Salvar"}</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}