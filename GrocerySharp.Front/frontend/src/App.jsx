import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UsersPage from './pages/UsersPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BrowserRouter>
        <Routes>
          {/* Autenticação */}
          <Route path="/login" element={<LoginPage isAdmin={false} />} />
          <Route path="/admin/login" element={<LoginPage isAdmin={true} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/users" element={<PrivateRoute roles={["Admin"]}><UsersPage /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute roles={["Admin", "Employee"]}><ProductsPage /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute roles={["Admin"]}><CategoriesPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute roles={["Admin"]}><OrdersPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;