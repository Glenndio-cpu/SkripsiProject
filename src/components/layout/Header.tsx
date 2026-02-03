import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClinicMedical, FaUser, FaSignOutAlt, FaUserCircle } from "react-icons/fa";

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; profileImage?: string; role?: string } | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek apakah user sudah login
    const updateUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    };
    
    updateUser();

    // Listen for storage changes (untuk sync antar tab)
    window.addEventListener('storage', updateUser);

    // Custom event untuk update dalam tab yang sama
    window.addEventListener('userUpdated', updateUser);

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('storage', updateUser);
      window.removeEventListener('userUpdated', updateUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <FaClinicMedical className="text-3xl text-blue-600 mr-4" />
            <h1 className="text-2xl font-bold text-healthcare-700">Puskesmas Wori Online</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-healthcare-600 font-medium focus:outline-none"
                >
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border-2 border-healthcare-200"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-healthcare-100 rounded-full flex items-center justify-center text-healthcare-600 font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span>{user.name}</span>
                  <svg className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    {user?.role === 'nurse' && (
                      <>
                        <Link
                          to="/admin/broadcast"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-healthcare-50 transition-colors"
                        >
                          <span className="mr-3">📣</span>
                          Broadcast Manager
                        </Link>
                        <hr className="my-1" />
                      </>
                    )}
                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-gray-700 hover:bg-healthcare-50 transition-colors"
                    >
                      <FaUser className="mr-3 text-healthcare-600" />
                      Akun Saya
                    </Link>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <FaSignOutAlt className="mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-healthcare-600 font-medium">Login</Link>
                <Link to="/register" className="text-gray-700 hover:text-healthcare-600 font-medium">Mendaftar</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;