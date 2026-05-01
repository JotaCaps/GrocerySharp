    import { getToken } from "../services/authToken";

function parseJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function useCurrentUser() {
  const token = getToken();
  if (!token) return { name: null, email: null, roles: [], isAdmin: false, isEmployee: false, isCustomer: false };

  const payload = parseJwt(token);
  if (!payload) return { name: null, email: null, roles: [], isAdmin: false, isEmployee: false, isCustomer: false };

  const email = payload["email"] || payload["sub"] || null;

  const roleClaim =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload["role"] ||
    null;

  const roles = roleClaim
    ? Array.isArray(roleClaim)
      ? roleClaim
      : [roleClaim]
    : [];

  const name = email ? email.split("@")[0] : "Usuário";

  const isAdmin = roles.includes("Admin");
  const isEmployee = roles.includes("Employee");
  const isCustomer = roles.includes("Customer");

  return { name, email, roles, isAdmin, isEmployee, isCustomer };
}