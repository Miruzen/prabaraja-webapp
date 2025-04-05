
import { 
  Home, 
  LayoutDashboard, 
  FileText, 
  Wallet, 
  ShoppingBag,
  ShoppingCart,
  MessageSquare,
  Users,
  Package,
  Database,
  Settings,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-4 py-3 text-sidebar-text hover:bg-sidebar-hover transition-colors duration-200 mx-2 rounded-[20px] ${
      isActive ? 'bg-sidebar-active p-[10px]' : ''
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export const Sidebar = () => {
  const currentPath = window.location.pathname;
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all user-related data from localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userEmail');
    
    // Don't remove username to persist it across sessions
    // This is just for demo purposes - in a real app you'd likely clear all data

    // Redirect to the Login Page
    navigate('/login');
  };

  const navItems = [
    { icon: <Home size={20} />, label: 'Home', href: '/' },
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
    { icon: <FileText size={20} />, label: 'Reports', href: '/reports' },
    { icon: <Wallet size={20} />, label: 'Cash & bank', href: '/cash-bank' },
    { icon: <ShoppingBag size={20} />, label: 'Sales', href: '/sales' },
    { icon: <ShoppingCart size={20} />, label: 'Purchases', href: '/purchases' },
    { icon: <MessageSquare size={20} />, label: 'Expenses', href: '/expenses' },
    { icon: <Users size={20} />, label: 'Contacts', href: '/contacts' },
    { icon: <Package size={20} />, label: 'Products', href: '/products' },
    { icon: <Database size={20} />, label: 'Assets', href: '/assets' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-56 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      <div className="flex-1 py-4 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={currentPath === item.href}
          />
        ))}
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 text-sidebar-text hover:bg-sidebar-hover transition-colors duration-200 mx-2 rounded-[20px] mb-4"
      >
        <LogOut size={20} className="text-red-500" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </div>
  );
};
