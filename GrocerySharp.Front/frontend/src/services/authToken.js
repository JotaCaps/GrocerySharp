const TOKEN_KEY = "grocerysharp_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) ?? null;
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}