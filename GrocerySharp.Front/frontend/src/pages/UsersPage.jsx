import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { useCrud } from "../hooks/useCrud";

function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

function rolesToText(roles) {
  if (!roles) return "—";
  if (!Array.isArray(roles) || roles.length === 0) return "—";

  if (typeof roles[0] === "string") return roles.join(", ");
  return roles.map((r) => r?.name ?? `Role #${r?.id}`).join(", ");
}




const ROLE_OPTIONS = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Employee" },
  { id: 3, name: "Customer" },
];

const emptyForm = {
  id: undefined,
  name: "",
  email: "",
  phone: "",
  password: "",
  roleId: 0,
};

export default function UsersPage() {
  const { items, loading, busy, error, setError, create, update, remove, load } = useCrud("users", "id");

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); 
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;

    return items.filter((u) => {
      const name = normalize(u?.name);
      const email = normalize(u?.email);
      const phone = normalize(u?.phone);
      return name.includes(q) || email.includes(q) || phone.includes(q);
    });
  }, [items, query]);

  function openCreate() {
    setError("");
    setMode("create");
    setForm(emptyForm);
    setIsOpen(true);
  }

  function openEdit(user) {
    setError("");
    setMode("edit");
    setForm({
      id: user?.id,
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      password: "",
      roleId: user?.roleId ?? user?.roles?.[0]?.id ?? 0,
    });
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setError("");
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errs = [];
    if (!form.name?.trim()) errs.push("Nome é obrigatório.");
    if (!form.email?.trim()) errs.push("Email é obrigatório.");
    if (!form.phone?.trim()) errs.push("Telefone é obrigatório.");

    if (mode === "create" && !form.password?.trim()) errs.push("Senha é obrigatória ao criar usuário.");

    if (!Number(form.roleId) || Number(form.roleId) <= 0) errs.push("Selecione um Role.");
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
      if (mode === "create") {
        await create({
          name: form.name,
          email: form.email,
          phone: form.phone,
          password: form.password,
          roleId: Number(form.roleId),
        });
      } else {
        const payload = {
          id: form.id,
          name: form.name,
          email: form.email,
          phone: form.phone,
          roleId: Number(form.roleId),
        };

        if (form.password?.trim()) payload.password = form.password;

        await update(payload);
      }

      closeModal();
    } catch {

    }
  }

  async function confirmDelete(user) {
    const ok = window.confirm(`Deletar usuário "${user?.name}" (ID: ${user?.id})?`);
    if (!ok) return;

    try {
      await remove(user.id);
    } catch {

    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
          <p className="text-gray-500 mt-1">
            CRUD em <span className="font-mono">/api/users</span>
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Voltar ao Dashboard
          </Link>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          + Novo usuário
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou telefone…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
          >
            Recarregar
          </button>

          <div className="text-sm text-gray-500">
            {loading ? "Carregando…" : `${filtered.length} de ${items.length} usuário(s)`}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Lista de usuários</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Nome</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Email</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Telefone</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Roles</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={6}>
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-mono">{u.id}</td>
                    <td className="px-4 py-3 text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-800">{u.email}</td>
                    <td className="px-4 py-3 text-gray-800">{u.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-800">{rolesToText(u.roles)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(u)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(u)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                        >
                          Deletar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <Modal
          title={mode === "create" ? "Criar usuário" : `Editar usuário #${form.id}`}
          onClose={closeModal}
        >
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome">
                <input
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </Field>

              <Field label="Telefone">
                <input
                  value={form.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </Field>

              <Field
                label={mode === "create" ? "Senha" : "Nova senha (opcional)"}
                hint={mode === "edit" ? "Deixe vazio para não alterar." : undefined}
              >
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                />
              </Field>

              <Field label="Role">
                <select
                  value={form.roleId}
                  onChange={(e) => setField("roleId", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                >
                  <option value={0}>Selecione…</option>
                  {ROLE_OPTIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={busy}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60"
              >
                {busy ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
