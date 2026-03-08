import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Acesso negado</h1>
        <p className="text-gray-500 mb-6">
          Você não tem permissão para acessar esta página.
        </p>
        <button
          onClick={() => nav("/", { replace: true })}
          className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          Voltar ao Dashboard
        </button>
      </div>
    </div>
  );
}