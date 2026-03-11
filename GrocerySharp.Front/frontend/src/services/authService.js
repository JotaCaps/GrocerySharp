import { api } from "./api";

const CUSTOMER_ROLE_ID = 3; // menor nível da hierarquia

/**
 * PUT /api/auth/login
 * Payload: { email, password }
 * Response: { token }
 */
export async function login({ email, password }) {
  const res = await api.put("/api/auth/login", { email, password });
  return res.data; // { token }
}

/**
 * POST /api/users  (AllowAnonymous)
 * Payload: { name, email, phone, password, roleId }
 * Cadastro público sempre cria como Customer (roleId = 3)
 */
export async function register({ name, email, phone, password }) {
  const payload = {
    name,
    email,
    phone,
    password,
    roleId: CUSTOMER_ROLE_ID,
  };

  const res = await api.post("/api/users", payload);
  return res.data;
}