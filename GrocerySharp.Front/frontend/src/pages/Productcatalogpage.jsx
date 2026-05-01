// Customer: GET /api/products é AllowAnonymous — somente leitura
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCrud } from "../hooks/useCrud";

function normalize(str) { return (str || "").toString().toLowerCase().trim(); }
function formatPrice(v) { return Number(v).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

export default function ProductCatalogPage() {
  const { items, loading, load } = useCrud("products", "id");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((p) => normalize(p?.name).includes(q) || normalize(p?.description).includes(q));
  }, [items, query]);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Produtos</h1>
        <p className="text-gray-500 mt-1">Explore os produtos disponíveis</p>
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar produto…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <div className="flex items-center gap-2">
          <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Recarregar</button>
          <span className="text-sm text-gray-500">{loading ? "Carregando…" : `${filtered.length} produto(s)`}</span>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500">Carregando produtos…</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-500">Nenhum produto encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex flex-col gap-3">
              {p.img && (p.img.startsWith("http://") || p.img.startsWith("https://")) && (
                <img src={p.img} alt={p.name} className="w-full h-40 object-cover rounded-lg bg-gray-100" onError={(e) => { e.target.style.display = "none"; }} />
              )}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
                <p className="text-gray-500 text-sm mt-1 line-clamp-3">{p.description}</p>
              </div>
              <div className="mt-auto">
                <span className="text-xl font-bold text-gray-900">{formatPrice(p.price)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}