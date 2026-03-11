export function normalize(str) {
  return (str || "").toString().trim();
}

export function isValidEmail(email) {
  const e = normalize(email).toLowerCase();
  // simples e suficiente pro front (o backend valida de verdade)
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// (XX) XXXXX-XXXX
export function formatPhoneBR(value) {
  const digits = (value || "").replace(/\D/g, "").slice(0, 11);

  const ddd = digits.slice(0, 2);
  const part1 = digits.slice(2, 7);
  const part2 = digits.slice(7, 11);

  if (digits.length <= 2) return ddd ? `(${ddd}` : "";
  if (digits.length <= 7) return `(${ddd}) ${part1}`;
  return `(${ddd}) ${part1}-${part2}`;
}

export function isValidPhoneBR(value) {
  const digits = (value || "").replace(/\D/g, "");
  return digits.length === 11; // padrão celular BR
}

export function isProbablyImageUrl(url) {
  const s = normalize(url);
  if (!s) return true; // opcional
  if (!/^https?:\/\/.+/i.test(s)) return false;

  // aceita querystring e extensões comuns
  return /\.(png|jpg|jpeg|webp|gif|bmp|svg)(\?.*)?$/i.test(s) || s.includes("image");
}

// recomendado: 1 maiúscula, 1 número, 1 símbolo (não obrigatório, mas vamos validar)
export function passwordHasRecommendedStrength(pw) {
  const s = pw || "";
  const hasUpper = /[A-Z]/.test(s);
  const hasNumber = /\d/.test(s);
  const hasSymbol = /[^A-Za-z0-9]/.test(s);
  return hasUpper && hasNumber && hasSymbol;
}