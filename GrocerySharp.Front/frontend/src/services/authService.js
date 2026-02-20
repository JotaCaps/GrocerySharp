import { api } from "./api";

/**
 * BACKEND GAP:
 * - Defina aqui o endpoint real de login no seu backend.
 *   Exemplo comum: POST /api/auth/login
 *   Payload: { email, password } (LoginInputModel)
 *   Response: { token } (LoginViewModel)
 */
export async function login({ email, password, isAdmin }) {
  // MOCK por enquanto (remove quando o endpoint existir)
  // Simula: admin@admin.com / 123
  if (!import.meta.env.VITE_USE_REAL_AUTH) {
    if (!email || !password) throw new Error("Email e senha são obrigatórios.");
    if (isAdmin && email !== "admin@admin.com") throw new Error("Admin inválido (mock).");
    return { token: "MOCK_JWT_TOKEN" };
  }

  // ✅ QUANDO PLUGAR NO BACKEND:
  // const res = await api.post("/api/auth/login", { email, password });
  // return res.data;

  throw new Error("Auth real não configurado. Configure VITE_USE_REAL_AUTH e endpoint.");
}

/**
 * BACKEND GAP:
 * - Cadastro pode ser seu endpoint atual de usuários:
 *   POST /api/users
 *   Payload: { name, email, phone, password, roleId? }
 */
export async function register({ name, email, phone, password }) {
  // MOCK por enquanto
  if (!import.meta.env.VITE_USE_REAL_AUTH) {
    if (!name || !email || !phone || !password) throw new Error("Preencha tudo.");
    return { ok: true };
  }

  // ✅ QUANDO PLUGAR NO BACKEND:
  // return (await api.post("/api/users", { name, email, phone, password, roleId: 3 })).data;

  throw new Error("Register real não configurado.");
}