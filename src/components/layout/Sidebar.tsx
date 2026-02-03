
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const [animationClass, setAnimationClass] = useState('');
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; profileImage?: string; role?: string } | null>(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setAnimationClass('animate-slide-in');
    } else {
      setAnimationClass('animate-slide-out');
    }

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

    // Listen for user updates
    window.addEventListener('userUpdated', updateUser);
    
    return () => {
      window.removeEventListener('userUpdated', updateUser);
    };
  }, [isOpen]);

  // Check if content is scrollable
  useEffect(() => {
    const checkScrollable = () => {
      const scrollContainer = document.getElementById('sidebar-scroll-container');
      if (scrollContainer) {
        const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        setShowScrollIndicator(isScrollable && scrollContainer.scrollTop === 0);
      }
    };

    if (isOpen) {
      setTimeout(checkScrollable, 100); // Delay to ensure DOM is ready
    }

    window.addEventListener('resize', checkScrollable);
    return () => window.removeEventListener('resize', checkScrollable);
  }, [isOpen, user]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    setShowScrollIndicator(target.scrollTop === 0 && target.scrollHeight > target.clientHeight);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    // Notify other components in this tab to refresh their auth state
    window.dispatchEvent(new Event('userUpdated'));
    onClose();
    navigate('/');
  };

  return (
    <div 
      className={`fixed top-0 left-0 h-full w-60 bg-sidebar shadow-lg z-30 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${animationClass} flex flex-col`}
    >
      {/* Header - Fixed */}
      <div className="flex-shrink-0 px-4 py-6 border-b border-sidebar-accent">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-sidebar-foreground">Menu</h2>
          <button 
            onClick={onClose}
            className="text-sidebar-foreground hover:text-sidebar-primary text-2xl"
          >
            
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div 
        id="sidebar-scroll-container"
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 scrollbar-thin scrollbar-thumb-sidebar-accent scrollbar-track-transparent hover:scrollbar-thumb-sidebar-primary relative"
      >
        {/* User Profile Section - hanya tampil jika sudah login */}
        {user && (
          <div className="mb-6 pb-6 border-b border-sidebar-accent">
            <div className="flex items-center px-2">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt="Profile" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-healthcare-200"
                />
              ) : (
                <div className="w-12 h-12 bg-healthcare-100 rounded-full flex items-center justify-center text-lg font-bold text-healthcare-600">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground opacity-75 truncate">{user.email}</p>
                {user.phone && (
                  <p className="text-xs text-sidebar-foreground opacity-75 truncate mt-0.5">
                    📞 {user.phone}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
        
        <nav>
          <ul className="space-y-4">
            <li>
              <Link 
                to="/" 
                className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={onClose}
              >
                <span className="mr-3">🏠</span> Beranda
              </Link>
            </li>
            <li>
              <Link 
                to="/tentang" 
                className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={onClose}
              >
                <span className="mr-3">ℹ️</span> Tentang
              </Link>
            </li>
            <li>
              <Link 
                to={user ? "/penyakit" : "/login"}
                className={`flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors ${!user ? 'opacity-70' : ''}`}
                onClick={onClose}
                title={!user ? 'Silakan login untuk mengakses' : undefined}
              >
                <span className="mr-3">{user ? '🦠' : '🔒'}</span> Info Penyakit
              </Link>
            </li>
            <li>
              <Link 
                to={user ? "/pencegahan" : "/login"}
                className={`flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors ${!user ? 'opacity-70' : ''}`}
                onClick={onClose}
                title={!user ? 'Silakan login untuk mengakses' : undefined}
              >
                <span className="mr-3">{user ? '🛡️' : '🔒'}</span> Pencegahan
              </Link>
            </li>
            <li>
              <Link 
                to={user ? "/konsultasi" : "/login"}
                className={`flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors ${!user ? 'opacity-70' : ''}`}
                onClick={onClose}
                title={!user ? 'Silakan login untuk mengakses' : undefined}
              >
                <span className="mr-3">{user ? '💬' : '🔒'}</span> Konsultasi
              </Link>
            </li>
            <li>
              <Link 
                to="/kontak" 
                className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                onClick={onClose}
              >
                <span className="mr-3">📞</span> Kontak
              </Link>
            </li>
            
            {/* Admin section for nurses */}
            {user?.role === 'nurse' && (
              <>
                <li className="pt-4 border-t border-sidebar-accent">
                  <div className="px-4 py-2 text-sm text-sidebar-foreground opacity-75 font-semibold">
                    Menu Admin
                  </div>
                </li>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">📊</span> Dashboard Admin
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/patients"
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">�</span> Kelola Pasien
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/broadcast"
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">📢</span> Broadcast WhatsApp
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/register"
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">➕</span> Tambah Admin
                  </Link>
                </li>
              </>
            )}
            
            {/* User Menu - hanya tampil jika sudah login */}
            {user ? (
              <>
                <li className="pt-4 border-t border-sidebar-accent">
                  <div className="px-4 py-2 text-sm text-sidebar-foreground opacity-75">
                    Akun
                  </div>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">👤</span> Akun Saya
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-sidebar-foreground hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
                  >
                    <span className="mr-3">🚪</span> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="pt-4 border-t border-sidebar-accent">
                  <Link 
                    to="/login" 
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">🔐</span> Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    className="flex items-center px-4 py-3 text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                    onClick={onClose}
                  >
                    <span className="mr-3">📝</span> Mendaftar
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div className="sticky bottom-0 left-0 right-0 flex justify-center py-2 bg-gradient-to-t from-sidebar to-transparent pointer-events-none">
            <div className="animate-bounce text-sidebar-foreground opacity-50">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        )}
      </div>
      {/* End of Scrollable Content */}
    </div>
  );
};

export default Sidebar;
