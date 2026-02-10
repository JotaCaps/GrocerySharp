import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// Componente temporário para telas em construção
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold">{title}</h1>
    <p className="text-gray-600">Em breve, conectaremos com o Swagger...</p>
    <a href="/" className="text-blue-500 hover:underline mt-4 block">Voltar ao Menu</a>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/users" element={<Placeholder title="Gerenciamento de Usuários" />} />
          <Route path="/products" element={<Placeholder title="Catálogo de Produtos" />} />
          <Route path="/categories" element={<Placeholder title="Categorias" />} />
          <Route path="/orders" element={<Placeholder title="Pedidos" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;