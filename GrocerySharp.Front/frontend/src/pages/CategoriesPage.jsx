import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import Field from "../components/Field";
import { useCrud } from "../hooks/useCrud";

function normalize(str) {
  return (str || "").toString().toLowerCase().trim();
}

const emptyForm = {
  id: undefined,
  name: "",
};

export default function CategoriesPage() {
  const { items, loading, busy, error, setError, create, update, remove, load } =
    useCrud("categories", "id");

  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = normalize(query);
    if (!q) return items;

    return items.filter((c) => normalize(c?.name).includes(q));
  }, [items, query]);

  function openCreate() {
    setError("");
    setMode("create");
    setForm(emptyForm);
    setIsOpen(true);
  }

  function openEdit(category) {
    setError("");
    setMode("edit");
    setForm({
      id: category?.id,
      name: category?.name ?? "",
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
    if (form.name?.trim()?.length < 2) errs.push("Nome precisa ter pelo menos 2 caracteres.");
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
      const payload = { name: form.name.trim() };

      if (mode === "create") {
        await create(payload);
      } else {
        await update({ id: form.id, ...payload });
      }

      closeModal();
    } catch {
    }
  }

  async function confirmDelete(category) {
    const ok = window.confirm(
      `Deletar categoria "${category?.name}" (ID: ${category?.id})?\n\nObs: se tiver produto relacionado, pode dar erro dependendo das regras do banco.`
    );
    if (!ok) return;

    try {
      await remove(category.id);
    } catch {
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Categorias</h1>
          <p className="text-gray-500 mt-1">
            CRUD em <span className="font-mono">/api/categories</span>
          </p>
          <Link to="/" className="text-blue-600 hover:underline text-sm">
            ← Voltar ao Dashboard
          </Link>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          + Nova categoria
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
          placeholder="Buscar categoria…"
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
            {loading ? "Carregando…" : `${filtered.length} de ${items.length} categoria(s)`}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Lista de categorias</span>
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">ID</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Nome</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={3}>
                    Carregando…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={3}>
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-mono">{c.id}</td>
                    <td className="px-4 py-3 text-gray-800">{c.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(c)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(c)}
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
          title={mode === "create" ? "Criar categoria" : `Editar categoria #${form.id}`}
          onClose={closeModal}
          maxWidth="max-w-xl"
        >
          <form onSubmit={submit} className="space-y-4">
            <Field label="Nome da categoria" hint="Ex: Bebidas, Hortifruti, Limpeza…">
              <input
                value={form.name}
                onChange={(e) => setField("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </Field>

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
