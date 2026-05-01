// Customer: cria e vê APENAS seus próprios pedidos
// POST /api/orders — o backend atual exige Admin,Employee no POST
// ATENÇÃO: para o Customer criar pedidos, o backend precisa de um endpoint
// POST /api/orders/my ou ampliar a role do POST.
// Por ora, a listagem tenta GET /api/orders/my e o criar tenta POST /api/orders (retornará 403).
// A tela avisa o usuário quando isso ocorrer.
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { api } from "../services/api";
import { extractApiError } from "../shared/apiErrors";

function normalize(str) { return (str || "").toString().toLowerCase().trim(); }

const ORDER_STATUS = [
  { id: 1, label: "Aguardando pagamento" },
  { id: 2, label: "Pagamento aprovado" },
  { id: 3, label: "Enviado" },
  { id: 4, label: "Entregue" },
  { id: 5, label: "Cancelado" },
];

const STATUS_COLORS = {
  1: "bg-yellow-100 text-yellow-700",
  2: "bg-green-100 text-green-700",
  3: "bg-blue-100 text-blue-700",
  4: "bg-gray-100 text-gray-700",
  5: "bg-red-100 text-red-700",
};

function statusLabel(value) {
  const found = ORDER_STATUS.find((s) => s.id === Number(value));
  return found?.label ?? String(value ?? "—");
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ items: [{ productId: 0, quantity: 1 }] });

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      // Endpoint a ser criado no backend: GET /api/orders/my
      const res = await api.get("/api/orders/my");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      if (err?.response?.status === 404 || err?.response?.status === 405) {
        setError("O endpoint GET /api/orders/my ainda não foi implementado no backend. Peça ao administrador para adicioná-lo.");
      } else {
        setError(extractApiError(err) || "Falha ao carregar pedidos.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
    api.get("/api/products").then((r) => setProducts(Array.isArray(r.data) ? r.data : [])).catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return orders;
    return orders.filter((o) =>
      String(o?.id ?? "").includes(q) ||
      normalize(statusLabel(o?.orderStatus)).includes(q)
    );
  }, [orders, query]);

  function setItem(idx, patch) {
    setForm((prev) => {
      const next = [...prev.items];
      next[idx] = { ...next[idx], ...patch };
      return { ...prev, items: next };
    });
  }
  function addItem() { setForm((prev) => ({ ...prev, items: [...prev.items, { productId: 0, quantity: 1 }] })); }
  function removeItem(idx) {
    setForm((prev) => {
      const next = prev.items.filter((_, i) => i !== idx);
      return { ...prev, items: next.length ? next : [{ productId: 0, quantity: 1 }] };
    });
  }

  const estimatedTotal = useMemo(() => {
    return form.items.reduce((sum, it) => {
      const p = products.find((x) => x.id === Number(it.productId));
      return sum + (Number(p?.price) || 0) * (Number(it.quantity) || 0);
    }, 0);
  }, [form.items, products]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const validItems = form.items.filter((it) => Number(it.productId) > 0 && Number(it.quantity) > 0);
    if (!validItems.length) { setError("Adicione pelo menos 1 item válido."); return; }

    setBusy(true);
    try {
      // O backend atual exige Admin,Employee no POST /api/orders.
      // Para Customer, o backend precisa de POST /api/orders/my ou ampliar as roles.
      await api.post("/api/orders", {
        userId: 0, // backend sobrescreve com o usuário do token (quando implementado)
        items: validItems.map((it) => ({ productId: Number(it.productId), quantity: Number(it.quantity), price: 0 })),
        orderStatus: 1,
      });
      setIsOpen(false);
      setForm({ items: [{ productId: 0, quantity: 1 }] });
      await loadOrders();
    } catch (err) {
      if (err?.response?.status === 403) {
        setError("Sem permissão para criar pedidos. O backend ainda não permite que Customers criem pedidos diretamente. Contate o administrador.");
      } else {
        setError(extractApiError(err) || "Falha ao criar pedido.");
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
          <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
        </div>
        <button onClick={() => { setError(""); setIsOpen(true); }} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
          + Novo pedido
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>}

      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por ID ou status…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
        <div className="flex items-center gap-2">
          <button onClick={loadOrders} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Recarregar</button>
          <span className="text-sm text-gray-500">{loading ? "Carregando…" : `${filtered.length} pedido(s)`}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={3}>Carregando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={3}>Nenhum pedido encontrado.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-800">#{o.id}</td>
                    <td className="px-4 py-3 text-gray-800">{o.orderDate ? new Date(o.orderDate).toLocaleString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.orderStatus] ?? "bg-gray-100 text-gray-700"}`}>
                        {statusLabel(o.orderStatus)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && (
        <Modal title="Novo pedido" onClose={() => setIsOpen(false)} maxWidth="max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold text-gray-800">Itens</span>
                <button type="button" onClick={addItem} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white text-sm">+ Adicionar item</button>
              </div>
              <div className="space-y-3">
                {form.items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-3 bg-white border border-gray-100 rounded-xl p-3">
                    <div className="col-span-7">
                      <Field label={`Produto #${idx + 1}`}>
                        <select value={it.productId} onChange={(e) => setItem(idx, { productId: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white">
                          <option value={0}>Selecione…</option>
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name} — {Number(p.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    <div className="col-span-3">
                      <Field label="Qtd.">
                        <input type="number" min={1} value={it.quantity} onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
                      </Field>
                    </div>
                    <div className="col-span-2 flex items-end">
                      <button type="button" onClick={() => removeItem(idx)} className="w-full px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm">X</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 text-right text-gray-700">
                Total estimado: <span className="font-semibold">{estimatedTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100">Cancelar</button>
              <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60">{busy ? "Criando…" : "Criar pedido"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}