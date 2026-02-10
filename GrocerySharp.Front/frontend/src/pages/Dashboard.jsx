// src/pages/Dashboard.jsx
import { Users, Package, Tags, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const menuItems = [
  { title: 'Usuários', icon: <Users size={32} />, path: '/users', color: 'bg-blue-500', desc: 'Gerenciar clientes' },
  { title: 'Produtos', icon: <Package size={32} />, path: '/products', color: 'bg-green-500', desc: 'Gerenciar produtos' },
  { title: 'Categorias', icon: <Tags size={32} />, path: '/categories', color: 'bg-purple-500', desc: 'Gerenciar categorias' },
  { title: 'Pedidos', icon: <ShoppingCart size={32} />, path: '/orders', color: 'bg-orange-500', desc: 'Gerenciar vendas' },
];

export default function Dashboard() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">GrocerySharp Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <Link 
            to={item.path} 
            key={item.title}
            className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              {item.icon}
            </div>
            <h2 className="text-xl font-semibold text-gray-700">{item.title}</h2>
            <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}