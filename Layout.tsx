import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Users, PenTool, ExternalLink, Menu, X, Settings } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Panel Principal' },
    { to: '/noticias', icon: <Newspaper size={20} />, label: 'Gestión Noticias' },
    { to: '/crear-noticia', icon: <PenTool size={20} />, label: 'Nueva Noticia' },
    { to: '/autores', icon: <Users size={20} />, label: 'Equipo / Autores' },
    { to: '/configuracion', icon: <Settings size={20} />, label: 'Configuración' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-brand-dark text-white p-4 flex justify-between items-center">
        <span className="font-bold text-xl flex items-center gap-2">
           <span className="text-brand-red">Tendido</span>Digital
        </span>
        <button onClick={toggleMenu}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        bg-brand-dark text-white w-full md:w-64 flex-shrink-0 
        flex flex-col transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'block' : 'hidden md:flex'}
      `}>
        <div className="p-6 border-b border-gray-700 hidden md:block">
           <h1 className="font-bold text-2xl tracking-tighter">
             TENDIDO<span className="text-brand-red">DIGITAL</span>
           </h1>
           <p className="text-xs text-gray-400 mt-1">Panel de Gestión</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-brand-red text-white font-medium' 
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
            <a 
              href="https://tendidodigital.es" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <ExternalLink size={16} />
              Ver Página Web
            </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;