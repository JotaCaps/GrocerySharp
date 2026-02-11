import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { useCrud } from "../hooks/useCrud";
import { api } from "../services/api";

function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

const ORDER_STATUS = [
  { id: 1, label: "PaymentPending" },
  { id: 2, label: "PaymentAproved" },
  { id: 3, label: "Sipped" },
  { id: 4, label: "Delivered" },
  { id: 5, label: "Canceled" },
];

function statusLabel(value) {
  const n = Number(value);
  const found = ORDER_STATUS.find((s) => s.id === n);
  return found?.label ?? String(value ?? "—");
}

function extractApiError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message;
  if (typeof data === "string") return data;
  if (data?.title) return data.title;
  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = data.errors[firstKey]?.[0];
    return firstMsg || "Erro de validação";
  }
  return err?.message;
}

const emptyForm = {
  id: undefined,
  userId: 0,
  orderStatus: 1,
  items: [{ productId: 0, quantity: 1 }],
};

export default function OrdersPage() {
  const { items, loading, busy, error, setError, create, update, remove, load } =
    useCrud("orders", "id");

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create"); 
  const [form, setForm] = useState(emptyForm);


  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  async function loadUsers() {
    setUsersLoading(true);
    try {
      const res = await api.get("/api/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch {
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  }



  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  async function loadProducts() {
    setProductsLoading(true);
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
    loadUsers();
  }, []);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;

    return items.filter((o) => {
      const id = String(o?.id ?? "");
      const userId = String(o?.userId ?? "");
      const status = normalize(statusLabel(o?.orderStatus));
      return id.includes(q) || userId.includes(q) || status.includes(q);
    });
  }, [items, query]);

  function openCreate() {
    setError("");
    setMode("create");
    setForm(emptyForm);
    setIsOpen(true);
  }

  function openEdit(order) {
    setError("");
    setMode("edit");
    setForm({
      id: order?.id,
      userId: order?.userId ?? 0,
      orderStatus: Number(order?.orderStatus ?? 1),
      items: [{ productId: 0, quantity: 1 }],
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

  function setItem(index, patch) {
    setForm((prev) => {
      const next = [...prev.items];
      next[index] = { ...next[index], ...patch };
      return { ...prev, items: next };
    });
  }

  function addItem() {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { productId: 0, quantity: 1 }],
    }));
  }

  function removeItem(index) {
    setForm((prev) => {
      const next = prev.items.filter((_, i) => i !== index);
      return { ...prev, items: next.length ? next : [{ productId: 0, quantity: 1 }] };
    });
  }

  const estimatedTotal = useMemo(() => {

    let total = 0;
    for (const it of form.items) {
      const p = products.find((x) => x.id === Number(it.productId));
      const qty = Number(it.quantity) || 0;
      const price = Number(p?.price) || 0;
      total += price * qty;
    }
    return total;
  }, [form.items, products]);

  function validateCreate() {
    const errs = [];
    if (!Number(form.userId) || Number(form.userId) <= 0) errs.push("UserId precisa ser maior que 0.");

    if (!form.items?.length) errs.push("Pedido precisa ter pelo menos 1 item.");

    form.items.forEach((it, idx) => {
      if (!Number(it.productId) || Number(it.productId) <= 0)
        errs.push(`Item #${idx + 1}: selecione um produto.`);
      if (!Number(it.quantity) || Number(it.quantity) <= 0)
        errs.push(`Item #${idx + 1}: quantidade precisa ser maior que 0.`);
    });

    return errs;
  }

  function validateEdit() {
    const errs = [];
    if (!Number(form.userId) || Number(form.userId) <= 0) errs.push("UserId precisa ser maior que 0.");
    if (!Number(form.orderStatus) || Number(form.orderStatus) <= 0) errs.push("Selecione um status válido.");
    return errs;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");

    const errs = mode === "create" ? validateCreate() : validateEdit();
    if (errs.length) {
      setError(errs.join(" "));
      return;
    }

    try {
      if (mode === "create") {

        await create({
          userId: Number(form.userId),
          items: form.items.map((it) => ({
            productId: Number(it.productId),
            quantity: Number(it.quantity),
            price: 0,
          })),

          orderStatus: 1,
        });
      } else {
       
        await update({
          id: form.id,
          userId: Number(form.userId),
          items: [],
          orderStatus: Number(form.orderStatus),
        });
      }

      closeModal();
    } catch {
    }
  }

  async function confirmDelete(order) {
    const ok = window.confirm(`Deletar pedido (ID: ${order?.id})?`);
    if (!ok) return;

    try {
      await remove(order.id);
    } catch {

    }
  }

  async function confirmPayment(order) {
    const ok = window.confirm(`Confirmar pagamento do pedido #${order?.id}?`);
    if (!ok) return;

    setError("");
    try {
      await api.put(`/api/orders/${order.id}/confirm-payment`);
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
          <p className="text-gray-500 mt-1">
            CRUD em <span className="font-mono">/api/orders</span>
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Voltar ao Dashboard
          </Link>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          + Novo pedido
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
          placeholder="Buscar por ID, UserId ou Status…"
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
            {loading ? "Carregando…" : `${filtered.length} de ${items.length} pedido(s)`}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Lista de pedidos</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">UserId</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Data</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={5}>
                    Nenhum pedido encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-mono">{o.id}</td>
                    <td className="px-4 py-3 text-gray-800 font-mono">{o.userId}</td>
                    <td className="px-4 py-3 text-gray-800">
                      {o.orderDate ? new Date(o.orderDate).toLocaleString("pt-BR") : "—"}
                    </td>
                    <td className="px-4 py-3 text-gray-800">{statusLabel(o.orderStatus)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(o)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => confirmDelete(o)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                        >
                          Deletar
                        </button>

                        {/* Confirmar pagamento só faz sentido quando PaymentPending */}
                        {Number(o.orderStatus) === 1 && (
                          <button
                            onClick={() => confirmPayment(o)}
                            className="px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm"
                          >
                            Confirmar pagamento
                          </button>
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
        <Modal
          title={mode === "create" ? "Criar pedido" : `Editar pedido #${form.id}`}
          onClose={closeModal}
          maxWidth="max-w-3xl"
        >
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Usuário">
                <select
                  value={form.userId}
                  onChange={(e) => setField("userId", Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                  disabled={usersLoading}
                >
                  <option value={0}>{usersLoading ? "Carregando usuários…" : "Selecione…"}</option>

                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      #{u.id} — {u.name}{u.email ? ` (${u.email})` : ""}
                    </option>
                  ))}
                </select>

                {!usersLoading && users.length === 0 && (
                  <div className="text-xs text-gray-400 mt-1">
                    Não consegui carregar usuários em <span className="font-mono">/api/users</span>.
                  </div>
                )}
              </Field>


              <Field
                label="OrderStatus"
                hint={mode === "create" ? "No create, seu backend sempre cria PaymentPending." : undefined}
              >
                <select
                  value={form.orderStatus}
                  onChange={(e) => setField("orderStatus", Number(e.target.value))}
                  disabled={mode === "create"}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white disabled:opacity-60"
                >
                  {ORDER_STATUS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {mode === "create" && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold text-gray-800">Itens do pedido</div>
                    <div className="text-sm text-gray-500">
                      O backend calcula o total usando o preço do produto no banco.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addItem}
                    className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-white text-sm"
                  >
                    + Adicionar item
                  </button>
                </div>

                {productsLoading && (
                  <div className="text-sm text-gray-500 mb-2">Carregando produtos…</div>
                )}

                <div className="space-y-3">
                  {form.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-gray-100 rounded-xl p-3"
                    >
                      <div className="md:col-span-7">
                        <Field label={`Produto (item #${idx + 1})`}>
                          <select
                            value={it.productId}
                            onChange={(e) => setItem(idx, { productId: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-white"
                          >
                            <option value={0}>Selecione…</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                #{p.id} — {p.name} ({Number(p.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })})
                              </option>
                            ))}
                          </select>
                        </Field>
                      </div>

                      <div className="md:col-span-3">
                        <Field label="Quantidade">
                          <input
                            type="number"
                            min={1}
                            value={it.quantity}
                            onChange={(e) => setItem(idx, { quantity: Number(e.target.value) })}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                          />
                        </Field>
                      </div>

                      <div className="md:col-span-2 flex items-end">
                        <button
                          type="button"
                          onClick={() => removeItem(idx)}
                          className="w-full px-3 py-2 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                        >
                          Remover
                        </button>
                      </div>

                      <div className="md:col-span-12 text-sm text-gray-600">
                        Subtotal (estimado):{" "}
                        <span className="font-medium">
                          {(() => {
                            const p = products.find((x) => x.id === Number(it.productId));
                            const price = Number(p?.price) || 0;
                            const qty = Number(it.quantity) || 0;
                            return (price * qty).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
                          })()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-right text-gray-700">
                  Total (estimado):{" "}
                  <span className="font-semibold">
                    {estimatedTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </div>
              </div>
            )}

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
