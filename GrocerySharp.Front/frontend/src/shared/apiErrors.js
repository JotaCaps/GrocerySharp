export function extractApiError(err) {
  const data = err?.response?.data;
  if (!data) return err?.message;

  if (typeof data === "string") return data;
  if (data?.title) return data.title; // ProblemDetails
  if (data?.errors) {
    const firstKey = Object.keys(data.errors)[0];
    const firstMsg = data.errors[firstKey]?.[0];
    return firstMsg || "Erro de validação";
  }
  return err?.message;
}
