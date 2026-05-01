// Employee: CRUD + confirmar pagamento em pedidos
// POST/PUT/DELETE/confirm-payment — Admin,Employee
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { useCrud } from "../hooks/useCrud";
import { api } from "../services/api";
import { extractApiError } from "../shared/apiErrors";

function normalize(str) { return (str || "").toString().toLowerCase().trim(); }

const ORDER_STATUS = [
  { id: 1, label: "PaymentPending" },
  { id: 2, label: "PaymentAproved" },
  { id: 3, label: "Shipped" },
  { id: 4, label: "Delivered" },
  { id: 5, label: "Canceled" },
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

const emptyForm = { id: undefined, userId: 0, orderStatus: 1, items: [{ productId: 0, quantity: 1 }] };

export default function EmployeeOrdersPage() {
  const { items, loading, busy, error, setError, create, update, remove, load } = useCrud("orders", "id");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/api/users").then((r) => setUsers(Array.isArray(r.data) ? r.data : [])).catch(() => setUsers([]));
    api.get("/api/products").then((r) => setProducts(Array.isArray(r.data) ? r.data : [])).catch(() => setProducts([]));
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((o) =>
      String(o?.id ?? "").includes(q) ||
      String(o?.userId ?? "").includes(q) ||
      normalize(statusLabel(o?.orderStatus)).includes(q)
    );
  }, [items, query]);

  function openCreate() { setError(""); setMode("create"); setForm(emptyForm); setIsOpen(true); }
  function openEdit(o) {
    setError("");
    setMode("edit");
    setForm({ id: o?.id, userId: o?.userId ?? 0, orderStatus: Number(o?.orderStatus ?? 1), items: [] });
    setIsOpen(true);
  }
  function closeModal() { setIsOpen(false); setError(""); }
  function setField(name, value) { setForm((prev) => ({ ...prev, [name]: value })); }
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
    if (!Number(form.userId) || Number(form.userId) <= 0) { setError("Selecione um usuário."); return; }
    try {
      if (mode === "create") {
        if (!form.items.length) { setError("Adicione pelo menos 1 item."); return; }
        await create({ userId: Number(form.userId), items: form.items.map((it) => ({ productId: Number(it.productId), quantity: Number(it.quantity), price: 0 })), orderStatus: 1 });
      } else {
        await update({ id: form.id, userId: Number(form.userId), items: [], orderStatus: Number(form.orderStatus) });
      }
      closeModal();
    } catch {}
  }

  async function confirmDelete(o) {
    if (!window.confirm(`Deletar pedido #${o?.id}?`)) return;
    try { await remove(o.id); } catch {}
  }

  async function confirmPayment(o) {
    if (!window.confirm(`Confirmar pagamento do pedido #${o?.id}?`)) return;
    setError("");
    try {
      await api.put(`/api/orders/${o.id}/confirm-payment`);
      await load();
    } catch (err) {
      setError(extractApiError(err) || "Falha ao confirmar pagamento");
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pedidos</h1>
          <p className="text-gray-500 mt-1">Gerenciar pedidos e confirmar pagamentos</p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">+ Novo pedido</button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>}

      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por ID, UserId ou Status…" className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
        <div className="flex items-center gap-2">
          <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Recarregar</button>
          <span className="text-sm text-gray-500">{loading ? "Carregando…" : `${filtered.length} de ${items.length} pedido(s)`}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">UserId</th>
                <th className="px-4 py-3 font-semibold">Data</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Carregando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={5}>Nenhum pedido encontrado.</td></tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-800">{o.id}</td>
                    <td className="px-4 py-3 font-mono text-gray-800">{o.userId}</td>
                    <td className="px-4 py-3 text-gray-800">{o.orderDate ? new Date(o.orderDate).toLocaleString("pt-BR") : "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[o.orderStatus] ?? "bg-gray-100 text-gray-700"}`}>
                        {statusLabel(o.orderStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openEdit(o)} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Editar</button>
                        <button onClick={() => confirmDelete(o)} className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm">Deletar</button>
                        {Number(o.orderStatus) === 1 && (
                          <button onClick={() => confirmPayment(o)} className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm">Confirmar pagamento</button>
                        )}
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
        <Modal title={mode === "create" ? "Criar pedido" : `Editar pedido #${form.id}`} onClose={closeModal} maxWidth="max-w-3xl">
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Usuário">
                <select value={form.userId} onChange={(e) => setField("userId", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white">
                  <option value={0}>Selecione…</option>
                  {users.map((u) => <option key={u.id} value={u.id}>#{u.id} — {u.name}</option>)}
                </select>
              </Field>
              <Field label="Status" hint={mode === "create" ? "Sempre inicia como PaymentPending." : undefined}>
                <select value={form.orderStatus} onChange={(e) => setField("orderStatus", Number(e.target.value))} disabled={mode === "create"} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white disabled:opacity-60">
                  {ORDER_STATUS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </Field>
            </div>
            {mode === "create" && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-800">Itens do pedido</span>
                  <button type="button" onClick={addItem} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white text-sm">+ Adicionar item</button>
                </div>
                <div className="space-y-3">
                  {form.items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-3 bg-white border border-gray-100 rounded-xl p-3">
                      <div className="col-span-7">
                        <Field label={`Produto #${idx + 1}`}>
                          <select value={it.productId} onChange={(e) => setItem(idx, { productId: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white">
                            <option value={0}>Selecione…</option>
                            {products.map((p) => <option key={p.id} value={p.id}>#{p.id} — {p.name} ({Number(p.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})</option>)}
                          </select>
                        </Field>
                      </div>
                      <div className="col-span-3">
                        <Field label="Qtd.">
                          <input type="number" min={1} value={it.quantity} onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
                        </Field>
                      </div>
                      <div className="col-span-2 flex items-end">
                        <button type="button" onClick={() => removeItem(idx)} className="w-full px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm">Remover</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-right text-gray-700">
                  Total estimado: <span className="font-semibold">{estimatedTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                </div>
              </div>
            )}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={closeModal} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100">Cancelar</button>
              <button type="submit" disabled={busy} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-60">{busy ? "Salvando…" : "Salvar"}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}