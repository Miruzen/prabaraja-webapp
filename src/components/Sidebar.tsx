
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
  Truck,
  Database,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon, label, href, isActive }: NavItemProps) => (
  <Link
    to={href}
    className={`flex items-center gap-3 px-4 py-3 text-sidebar-text hover:bg-sidebar-hover transition-colors duration-200 ${
      isActive ? 'bg-sidebar-active' : ''
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

const Divider = () => <div className="h-px bg-sidebar-border my-3 mx-4" />;

export const Sidebar = () => {
  const [companyId] = useState('682598');
  const currentPath = window.location.pathname;

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
    { icon: <Truck size={20} />, label: 'Fulfillments', href: '/fulfillments' },
    { icon: <Database size={20} />, label: 'Assets', href: '/assets' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/settings' },
  ];

  return (
    <div className="w-64 h-screen bg-sidebar-bg border-r border-sidebar-border flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {navItems.map((item, i) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isActive={currentPath === item.href}
          />
        ))}
      </div>
      <Divider />
      <div className="p-4 flex items-center gap-2 text-sidebar-text">
        <ChevronLeft size={16} />
        <span className="text-sm">Company ID:{companyId}</span>
      </div>
    </div>
  );
};
