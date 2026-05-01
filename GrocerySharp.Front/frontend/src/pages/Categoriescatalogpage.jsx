// Customer: GET /api/categories é AllowAnonymous — somente leitura
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCrud } from "../hooks/useCrud";

function normalize(str) { return (str || "").toString().toLowerCase().trim(); }

export default function CategoriesCatalogPage() {
  const { items, loading, load } = useCrud("categories", "id");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((c) => normalize(c?.name).includes(q));
  }, [items, query]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
        <p className="text-gray-500 mt-1">Explore as categorias disponíveis</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
      </div>

      <div className="mb-6 flex gap-3 items-center">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar categoria…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
        <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Recarregar</button>
      </div>

      {loading ? (
        <div className="text-gray-500">Carregando…</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">Nenhuma categoria encontrada.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-center gap-3">
              <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 font-bold text-sm flex-shrink-0">
                {c.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="text-gray-800 font-medium">{c.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}