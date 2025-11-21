import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '▸'
    },
    {
      path: '/policies',
      label: 'Policies', 
      icon: '▸'
    },
    {
      path: '/controls',
      label: 'Controls',
      icon: '▸'
    },
    {
      path: '/reports',
      label: 'Reports',
      icon: '▸'
    },
    {
      path: '/billing',
      label: 'Billing',
      icon: '💳'
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '▸'
    }
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-blue-600">CompliAI</h1>
        <p className="text-sm text-gray-500 mt-1">AI-First Compliance OS</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <button
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors duration-150 ${
                  isActivePath(item.path)
                    ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="text-gray-400">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © {new Date().getFullYear()} CompliAI
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;