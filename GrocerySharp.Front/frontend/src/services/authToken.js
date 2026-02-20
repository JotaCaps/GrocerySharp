const TOKEN_KEY = "grocerysharp.token";
// const ROLES_KEY = "grocerysharp.roles"; // opcional (se você devolver roles no futuro)

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
//   localStorage.removeItem(ROLES_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken());
}