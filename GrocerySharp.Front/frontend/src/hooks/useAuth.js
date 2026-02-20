import { useState } from "react";
import { login as loginApi, register as registerApi } from "../services/authService";
import { setToken, clearToken, getToken } from "../services/authToken";
import { extractApiError } from "../shared/apiErrors";

export function useAuth() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function login({ email, password, isAdmin }) {
    setBusy(true);
    setError("");
    try {
      const res = await loginApi({ email, password, isAdmin });
      if (!res?.token) throw new Error("Token não veio na resposta.");
      setToken(res.token);
      return res;
    } catch (err) {
      const msg = extractApiError(err) || err?.message || "Falha no login";
      setError(msg);
      throw new Error(msg);
    } finally {
      setBusy(false);
    }
  }

  async function register(payload) {
    setBusy(true);
    setError("");
    try {
      return await registerApi(payload);
    } catch (err) {
      const msg = extractApiError(err) || err?.message || "Falha no cadastro";
      setError(msg);
      throw new Error(msg);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    clearToken();
  }

  return { busy, error, setError, login, register, logout, token: getToken() };
}