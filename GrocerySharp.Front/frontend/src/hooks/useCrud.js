import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";
import { extractApiError } from "../shared/apiErrors";

export function useCrud(resource, idKey = "id") {
  const endpoint = useMemo(() => `/api/${resource}`, [resource]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(endpoint);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(extractApiError(err) || "Falha ao carregar");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    load();
  }, [load]);

  const create = useCallback(
    async (payload) => {
      setBusy(true);
      setError("");
      try {
        await api.post(endpoint, payload);
        await load();
      } catch (err) {
        const msg = extractApiError(err) || "Falha ao criar";
        setError(msg);
        throw new Error(msg);
      } finally {
        setBusy(false);
      }
    },
    [endpoint, load]
  );

  const update = useCallback(
    async (payload) => {
      const id = payload?.[idKey];
      if (id === undefined || id === null) {
        const msg = `Payload sem "${idKey}" para update.`;
        setError(msg);
        throw new Error(msg);
      }

      setBusy(true);
      setError("");
      try {
        await api.put(`${endpoint}/${id}`, payload);
        await load();
      } catch (err) {
        const msg = extractApiError(err) || "Falha ao atualizar";
        setError(msg);
        throw new Error(msg);
      } finally {
        setBusy(false);
      }
    },
    [endpoint, idKey, load]
  );

  const remove = useCallback(
    async (id) => {
      setBusy(true);
      setError("");
      try {
        await api.delete(`${endpoint}/${id}`);
        await load();
      } catch (err) {
        const msg = extractApiError(err) || "Falha ao deletar";
        setError(msg);
        throw new Error(msg);
      } finally {
        setBusy(false);
      }
    },
    [endpoint, load]
  );

  return { endpoint, items, setItems, loading, busy, error, setError, load, create, update, remove };
}
