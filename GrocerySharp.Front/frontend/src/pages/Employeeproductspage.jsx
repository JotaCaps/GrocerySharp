// Employee: CRUD em produtos (POST/PUT/DELETE Admin,Employee)
// Reutiliza a lógica do ProductsPage do Admin, mas navega para /emp/*
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { useCrud } from "../hooks/useCrud";
import { isProbablyImageUrl } from "../shared/validators";

function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

function formatPriceBR(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "—";
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function isProbablyUrl(value) {
  const s = (value || "").trim();
  return s.startsWith("http://") || s.startsWith("https://");
}

const emptyForm = { id: undefined, name: "", description: "", price: 0, img: "" };

export default function EmployeeProductsPage() {
  const { items, loading, busy, error, setError, create, update, remove, load } =
    useCrud("products", "id");

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;
    return items.filter((p) =>
      normalize(p?.name).includes(q) || normalize(p?.description).includes(q)
    );
  }, [items, query]);

  function openCreate() { setError(""); setMode("create"); setForm(emptyForm); setIsOpen(true); }
  function openEdit(p) {
    setError("");
    setMode("edit");
    setForm({ id: p?.id, name: p?.name ?? "", description: p?.description ?? "", price: p?.price ?? 0, img: p?.img ?? "" });
    setIsOpen(true);
  }
  function closeModal() { setIsOpen(false); setError(""); }
  function setField(name, value) { setForm((prev) => ({ ...prev, [name]: value })); }

  function validate() {
    const errs = [];
    const name = form.name?.trim() || "";
    const desc = form.description?.trim() || "";
    if (!name) errs.push("Nome é obrigatório.");
    else if (name.length < 2) errs.push("Nome precisa ter pelo menos 2 caracteres.");
    const price = Number(form.price);
    if (Number.isNaN(price) || price <= 0) errs.push("Preço deve ser maior que zero.");
    if (!desc) errs.push("Descrição é obrigatória.");
    else if (desc.length < 10) errs.push("Descrição precisa ter pelo menos 10 caracteres.");
    const img = (form.img ?? "").trim();
    if (img && !isProbablyImageUrl(img)) errs.push("Img precisa ser uma URL de imagem válida.");
    return errs;
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = validate();
    if (errs.length) { setError(errs.join(" ")); return; }
    try {
      const payload = { name: form.name.trim(), description: form.description.trim(), price: Number(form.price), img: (form.img ?? "").trim() };
      if (mode === "create") await create(payload);
      else await update({ id: form.id, ...payload });
      closeModal();
    } catch {}
  }

  async function confirmDelete(p) {
    if (!window.confirm(`Deletar produto "${p?.name}" (ID: ${p?.id})?`)) return;
    try { await remove(p.id); } catch {}
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Produtos</h1>
          <p className="text-gray-500 mt-1">Criar, editar e remover produtos</p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">← Voltar ao Dashboard</Link>
        </div>
        <button onClick={openCreate} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition">
          + Novo produto
        </button>
      </div>

      {error && <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>}

      <div className="mb-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por nome ou descrição…"
          className="w-full md:max-w-md px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
        <div className="flex items-center gap-2">
          <button onClick={load} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Recarregar</button>
          <span className="text-sm text-gray-500">{loading ? "Carregando…" : `${filtered.length} de ${items.length} produto(s)`}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold">ID</th>
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Preço</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={4}>Carregando…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="px-4 py-6 text-gray-500" colSpan={4}>Nenhum produto encontrado.</td></tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-gray-800">{p.id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{p.name}</div>
                      <div className="text-gray-500 text-sm line-clamp-1">{p.description}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-800">{formatPriceBR(p.price)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openEdit(p)} className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm">Editar</button>
                        <button onClick={() => confirmDelete(p)} className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm">Deletar</button>
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
        <Modal title={mode === "create" ? "Criar produto" : `Editar produto #${form.id}`} onClose={closeModal}>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nome">
                <input value={form.name} onChange={(e) => setField("name", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </Field>
              <Field label="Preço (R$)" hint="Use ponto decimal: 12.50">
                <input type="number" step="0.01" value={form.price} onChange={(e) => setField("price", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
              </Field>
              <div className="md:col-span-2">
                <Field label="Descrição">
                  <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" />
                </Field>
              </div>
              <div className="md:col-span-2">
                <Field label="Imagem (URL)">
                  <input value={form.img} onChange={(e) => setField("img", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200" placeholder="https://…" />
                </Field>
              </div>
            </div>
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