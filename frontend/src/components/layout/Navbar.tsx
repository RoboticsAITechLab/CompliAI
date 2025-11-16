import React, { useState, useEffect, useRef } from 'react';

const Navbar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // TODO: Replace with actual user data from auth store
  const user = {
    name: 'Ankit',
    organization: 'MyCompany'
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log('Logout clicked');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Logo (visible on mobile when sidebar is hidden) */}
        <div className="flex items-center lg:hidden">
          <h1 className="text-xl font-bold text-blue-600">CompliAI</h1>
        </div>

        {/* Right side - Organization and User Menu */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Organization */}
          <div className="hidden md:flex items-center text-sm text-gray-600">
            <span className="font-medium">Org:</span>
            <span className="ml-1 font-semibold text-gray-900">{user.organization}</span>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-3 py-2"
            >
              <span>User ▾</span>
              <span className="text-gray-900">({user.name})</span>
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    // TODO: Navigate to profile
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    // TODO: Navigate to settings
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;