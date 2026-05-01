import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Admin
import UsersPage from './pages/UsersPage';
import OrdersPage from './pages/OrdersPage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';

// Employee
import EmployeeOrdersPage from './pages/EmployeeOrdersPage';
import EmployeeCategoriesPage from './pages/EmployeeCategoriesPage';
import EmployeeProductsPage from './pages/Employeeproductspage';
import EmployeeUsersPage from './pages/Employeeuserspage';

// Customer
import MyProfilePage from './pages/Myprofilepage';
import MyOrdersPage from './pages/Myorderspage';
import ProductCatalogPage from './pages/Productcatalogpage';
import CategoriesCatalogPage from './pages/Categoriescatalogpage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <BrowserRouter>
        <Routes>
          {/* Autenticação */}
          <Route path="/login" element={<LoginPage isAdmin={false} />} />
          <Route path="/admin/login" element={<LoginPage isAdmin={true} />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Dashboard (qualquer logado) */}
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* ── ADMIN ── */}
          <Route path="/users" element={<PrivateRoute roles={["Admin"]}><UsersPage /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute roles={["Admin"]}><OrdersPage /></PrivateRoute>} />
          <Route path="/categories" element={<PrivateRoute roles={["Admin"]}><CategoriesPage /></PrivateRoute>} />
          <Route path="/products" element={<PrivateRoute roles={["Admin"]}><ProductsPage /></PrivateRoute>} />

          {/* ── EMPLOYEE ── */}
          <Route path="/emp/orders" element={<PrivateRoute roles={["Employee"]}><EmployeeOrdersPage /></PrivateRoute>} />
          <Route path="/emp/categories" element={<PrivateRoute roles={["Employee"]}><EmployeeCategoriesPage /></PrivateRoute>} />
          <Route path="/emp/products" element={<PrivateRoute roles={["Employee"]}><EmployeeProductsPage /></PrivateRoute>} />
          <Route path="/emp/users" element={<PrivateRoute roles={["Employee"]}><EmployeeUsersPage /></PrivateRoute>} />

          {/* ── CUSTOMER ── */}
          <Route path="/my-profile" element={<PrivateRoute roles={["Customer"]}><MyProfilePage /></PrivateRoute>} />
          <Route path="/my-orders" element={<PrivateRoute roles={["Customer"]}><MyOrdersPage /></PrivateRoute>} />
          <Route path="/catalog" element={<PrivateRoute roles={["Customer"]}><ProductCatalogPage /></PrivateRoute>} />
          <Route path="/catalog/categories" element={<PrivateRoute roles={["Customer"]}><CategoriesCatalogPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;