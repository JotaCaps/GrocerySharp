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
  if (!token) return { name: null, email: null, roles: [] };

  const payload = parseJwt(token);
  if (!payload) return { name: null, email: null, roles: [] };

  // O AuthService grava: sub = email, ClaimTypes.Name = email, ClaimTypes.Role = role(s)
  const email = payload["email"] || payload["sub"] || null;

  // ClaimTypes.Role vira essa claim longa no JWT
  const roleClaim =
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
    payload["role"] ||
    null;

  const roles = roleClaim
    ? Array.isArray(roleClaim)
      ? roleClaim
      : [roleClaim]
    : [];

  // Nome: usa a parte antes do @ como fallback amigável
  const name = email ? email.split("@")[0] : "Usuário";

  return { name, email, roles };
}