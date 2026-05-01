// Employee: GET /api/users (Admin,Employee) — somente leitura
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCrud } from "../hooks/useCrud";

function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

function rolesToText(roles) {
  if (!roles || !Array.isArray(roles) || roles.length === 0) return "—";
  if (typeof roles[0] === "string") return roles.join(", ");
  return roles.map((r) => r?.name ?? `Role #${r?.id}`).join(", ");
}

export default function EmployeeUsersPage() {
  const { items, loading, load } = useCrud("users", "id");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((u) =>
      normalize(u?.name).includes(q) ||
      normalize(u?.email).includes(q) ||
      normalize(u?.phone).includes(q)
    );
  }, [items, query]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Usuários</h1>
        <p className="text-gray-500 mt-1">Visualização — somente leitura</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
      </div>

      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome, email ou telefone…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <div className="flex items-center gap-2">
          <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">
            Recarregar
          </button>
          <span className="text-sm text-gray-500">
            {loading ? "Carregando…" : `${filtered.length} de ${items.length} usuário(s)`}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Telefone</th>
                <th className="px-4 py-3 font-semibold">Roles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Carregando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Nenhum usuário encontrado.</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-800">{u.id}</td>
                    <td className="px-4 py-3 text-gray-800">{u.name}</td>
                    <td className="px-4 py-3 text-gray-800">{u.email}</td>
                    <td className="px-4 py-3 text-gray-800">{u.phone ?? "—"}</td>
                    <td className="px-4 py-3 text-gray-800">{rolesToText(u.roles)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}