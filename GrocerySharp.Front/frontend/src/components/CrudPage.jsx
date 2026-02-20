import { useMemo, useState } from "react";
import Modal from "./Modal";
import { useCrud } from "../hooks/useCrud";

function renderCell(value, col) {
  if (col.render) return col.render(value);
  if (value === null || value === undefined || value === "") return <span className="text-gray-400">—</span>;
  return String(value);
}

function extraButtonClass(variant) {
  if (variant === "primary") return "px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm";
  if (variant === "success") return "px-3 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm";
  if (variant === "warning") return "px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm";
  return "px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm";
}

async function runExtraAction(action, row, reload, setError) {
  if (action.confirmText) {
    const ok = window.confirm(action.confirmText);
    if (!ok) return;
  }

  try {
    await action.onClick(row);
    await reload();
  } catch (err) {
    setError(err?.message || "Falha na ação extra");
  }
}

function EntityForm({ fields, values, onSubmit, onCancel, idKey, mode, busy }) {
  const [form, setForm] = useState(values);

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {mode === "edit" && form?.[idKey] !== undefined && (
        <div className="text-sm text-gray-500">
          ID: <span className="font-mono">{String(form[idKey])}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((f) => (
          <div key={f.name} className="space-y-1">
            <label className="text-sm font-medium text-gray-700">{f.label}</label>

            {f.type === "textarea" ? (
              <textarea
                value={form?.[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                rows={4}
              />
            ) : f.type === "checkbox" ? (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  checked={Boolean(form?.[f.name])}
                  onChange={(e) => setField(f.name, e.target.checked)}
                />
                <span className="text-sm text-gray-600">{f.help || ""}</span>
              </div>
            ) : (
              <input
                type={f.type || "text"}
                value={form?.[f.name] ?? ""}
                onChange={(e) => setField(f.name, e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                placeholder={f.placeholder || ""}
                disabled={f.disabled}
              />
            )}

            {f.hint && <div className="text-xs text-gray-400">{f.hint}</div>}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
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
  );
}

export default function CrudPage({
  title,
  resource,
  idKey = "id",
  columns,
  formFields,
  initialCreateValues = {},
  initialEditValues = (row) => row,
  extraRowActions = [],
}) {
  const { endpoint, items, loading, busy, error, setError, load, create, update, remove } = useCrud(resource, idKey);

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);

  const endpointLabel = useMemo(() => endpoint, [endpoint]);

  function openCreate() {
    setMode("create");
    setSelected({ ...initialCreateValues });
    setIsOpen(true);
  }

  function openEdit(row) {
    setMode("edit");
    setSelected(initialEditValues(row));
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
    setSelected(null);
  }

  async function handleSubmit(values) {
    setError("");
    try {
      if (mode === "create") await create(values);
      else await update(values);
      closeModal();
    } catch {

    }
  }

  async function handleDelete(row) {
    const id = row?.[idKey];
    const ok = window.confirm(`Deletar ${title} (ID: ${id})?`);
    if (!ok) return;

    try {
      await remove(id);
    } catch {
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <p className="text-gray-500 mt-1">
            Endpoint: <span className="font-mono">{endpointLabel}</span>
          </p>
        </div>

        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          + Novo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-gray-700 font-semibold">Lista</span>
          {loading ? (
            <span className="text-gray-500 text-sm">Carregando…</span>
          ) : (
            <span className="text-gray-500 text-sm">{items.length} item(s)</span>
          )}
        </div>

        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className="px-4 py-3 font-semibold whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={columns.length + 1}>
                    Carregando…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500" colSpan={columns.length + 1}>
                    Nada aqui ainda.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr key={row?.[idKey]} className="hover:bg-gray-50">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-gray-800">
                        {renderCell(row?.[c.key], c)}
                      </td>
                    ))}

                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-sm"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() => handleDelete(row)}
                          className="px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-700 text-sm"
                        >
                          Deletar
                        </button>

                        {extraRowActions.map((act) => (
                          <button
                            key={act.label}
                            onClick={() => runExtraAction(act, row, load, setError)}
                            className={extraButtonClass(act.variant)}
                          >
                            {act.label}
                          </button>
                        ))}
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
        <Modal title={mode === "create" ? `Novo ${title}` : `Editar ${title}`} onClose={closeModal}>
          <EntityForm
            fields={formFields}
            values={selected || {}}
            onCancel={closeModal}
            onSubmit={handleSubmit}
            idKey={idKey}
            mode={mode}
            busy={busy}
          />
        </Modal>
      )}
    </div>
  );
}
