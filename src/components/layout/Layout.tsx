import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import AIAssistant from '../AIAssistant';

interface LayoutProps {
  children?: React.ReactNode;
  hideAIAssistant?: boolean;
}

const Layout = ({ children, hideAIAssistant = false }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [contentStyle, setContentStyle] = useState('');

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    if (sidebarOpen) {
      setContentStyle('translate-x-60');
    } else {
      setContentStyle('');
    }
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Sidebar Toggle Button with margin top */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-24 left-6 z-50 w-12 h-12 rounded-full bg-healthcare-600 text-white flex items-center justify-center shadow-lg hover:bg-healthcare-700 transition-transform duration-300 ${contentStyle} mt-4`}
      >
        <span className="text-xl">{sidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* Main Content Wrapper (moves with sidebar) */}
      <div className={`flex flex-col min-h-screen transition-transform duration-300 ${contentStyle}`}>
        <Header />
        
        <main className="flex-grow">
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </div>
        </main>
        
        <Footer scrollToTop={scrollToTop} />
        {/* AIAssistant dinonaktifkan - gunakan halaman Konsultasi untuk chat */}
        {/* {!hideAIAssistant && <AIAssistant />} */}
      </div>
    </div>
  );
};

export default Layout;