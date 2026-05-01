import { Link } from 'react-router-dom';
import { Users, Package, Tags, ShoppingCart, User } from 'lucide-react';
import { useCurrentUser } from '../hooks/useCurrentUser';

const ADMIN_ITEMS = [
  { title: 'Usuários', icon: <Users size={28} />, path: '/users', color: 'bg-blue-500', desc: 'CRUD completo de usuários' },
  { title: 'Produtos', icon: <Package size={28} />, path: '/products', color: 'bg-green-500', desc: 'CRUD completo de produtos' },
  { title: 'Categorias', icon: <Tags size={28} />, path: '/categories', color: 'bg-purple-500', desc: 'CRUD completo de categorias' },
  { title: 'Pedidos', icon: <ShoppingCart size={28} />, path: '/orders', color: 'bg-orange-500', desc: 'Gerenciar todos os pedidos' },
];

const EMPLOYEE_ITEMS = [
  { title: 'Usuários', icon: <Users size={28} />, path: '/emp/users', color: 'bg-blue-500', desc: 'Visualizar clientes' },
  { title: 'Produtos', icon: <Package size={28} />, path: '/emp/products', color: 'bg-green-500', desc: 'Criar e editar produtos' },
  { title: 'Categorias', icon: <Tags size={28} />, path: '/emp/categories', color: 'bg-purple-500', desc: 'Visualizar categorias' },
  { title: 'Pedidos', icon: <ShoppingCart size={28} />, path: '/emp/orders', color: 'bg-orange-500', desc: 'Gerenciar e confirmar pagamentos' },
];

const CUSTOMER_ITEMS = [
  { title: 'Meu Perfil', icon: <User size={28} />, path: '/my-profile', color: 'bg-blue-500', desc: 'Ver e editar seus dados' },
  {
    title: 'Meus Pedidos',
    icon: <ShoppingCart size={28} />,
    path: null,
    color: 'bg-gray-400',
    desc: 'Consulte um funcionário para verificar seus pedidos',
    disabled: true,
  },
  { title: 'Catálogo', icon: <Package size={28} />, path: '/catalog', color: 'bg-green-500', desc: 'Ver produtos disponíveis' },
  { title: 'Categorias', icon: <Tags size={28} />, path: '/catalog/categories', color: 'bg-purple-500', desc: 'Explorar categorias' },
];

function getRoleLabel(isAdmin, isEmployee, isCustomer) {
  if (isAdmin) return { label: 'Administrador', color: 'bg-red-100 text-red-700' };
  if (isEmployee) return { label: 'Funcionário', color: 'bg-blue-100 text-blue-700' };
  if (isCustomer) return { label: 'Cliente', color: 'bg-green-100 text-green-700' };
  return { label: 'Usuário', color: 'bg-gray-100 text-gray-700' };
}

function DashboardCard({ item }) {
  const baseCard = `p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all`;

  if (item.disabled) {
    return (
      <div className={`${baseCard} opacity-60 cursor-not-allowed`} title="Funcionalidade indisponível">
        <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4`}>
          {item.icon}
        </div>
        <h2 className="text-lg font-semibold text-gray-400">{item.title}</h2>
        <p className="text-gray-400 text-sm mt-1">{item.desc}</p>
        <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          Indisponível
        </span>
      </div>
    );
  }

  return (
    <Link
      to={item.path}
      className={`${baseCard} hover:shadow-md hover:-translate-y-1 group`}
    >
      <div className={`${item.color} w-12 h-12 rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
        {item.icon}
      </div>
      <h2 className="text-lg font-semibold text-gray-700">{item.title}</h2>
      <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
    </Link>
  );
}

export default function Dashboard() {
  const { name, isAdmin, isEmployee, isCustomer } = useCurrentUser();

  const items = isAdmin ? ADMIN_ITEMS : isEmployee ? EMPLOYEE_ITEMS : CUSTOMER_ITEMS;
  const { label, color } = getRoleLabel(isAdmin, isEmployee, isCustomer);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-gray-800">Olá, {name}!</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{label}</span>
        </div>
        <p className="text-gray-500">Bem-vindo ao GrocerySharp. O que deseja fazer hoje?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <DashboardCard key={item.title} item={item} />
        ))}
      </div>
    </div>
  );
}