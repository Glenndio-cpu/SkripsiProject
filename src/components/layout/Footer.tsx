import React from 'react';
import { Link } from 'react-router-dom';
import { FaClinicMedical } from 'react-icons/fa';

interface FooterProps {
  scrollToTop: () => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToTop }) => {
  return (
    <footer className="bg-healthcare-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <FaClinicMedical className="mr-2" />
              Puskesmas Wori Online

            </h3>
            <p className="text-healthcare-200 text-sm">
              Menyediakan Layanan Informasi Kesehatan
            </p>
          </div>

          {/* Links Column */}
          <div>
            <h4 className="text-lg font-medium mb-4">Navigasi</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link 
                  to="/tentang" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Tentang
                </Link>
              </li>
              <li>
                <Link 
                  to="/penyakit" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Info Penyakit
                </Link>
              </li>
			  <li>
                <Link 
                  to="/pencegahan" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Pencegahan
                </Link>
              </li>
			  <li>
                <Link 
                  to="/konsultasi" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Konsultasi
                </Link>
              </li>
              <li>
                <Link 
                  to="/kontak" 
                  className="text-healthcare-200 hover:text-white transition-colors"
                  onClick={scrollToTop}
                >
                  Kontak
                </Link>
              </li>
            </ul>
          </div>
          {/* SDG Column */}
          <div>
            <h4 className="text-lg font-medium mb-4">Mendukung SDGs</h4>
            <div className="flex flex-col space-y-4">
              <a 
                href="https://sdgs.un.org/goals/goal3" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold group-hover:bg-green-700 transition-colors">
                  3
                </div>
                <span className="text-healthcare-200 text-sm group-hover:text-white transition-colors">
                  Good Health & Well-being
                </span>
              </a>
              <a 
                href="https://sdgs.un.org/goals/goal12" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center space-x-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-bold group-hover:bg-amber-700 transition-colors">
                  12
                </div>
                <span className="text-healthcare-200 text-sm group-hover:text-white transition-colors">
                  Responsible Consumption
                </span>
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-lg font-medium mb-4">Kontak Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-healthcare-200 hover:text-white transition-colors">puskesmas.desawori@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-healthcare-200 hover:text-white transition-colors">+62 896-5739-8733</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-healthcare-200 hover:text-white transition-colors">Universitas Klabat</p>
                  <p className="text-white text-sm">Manado, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-healthcare-700 mt-8 pt-6 text-center">
          <p className="text-healthcare-300">
            © {new Date().getFullYear()} CHATBOT PENDAMPING PUSKESMAS SEBAGAI INOVASI LAYANAN KESEHATAN DESA WORI MENGGUNAKAN
WHATSAPP GATEWAY TERINTEGRASI RAG DAN LLM. Project Skripsi.
          </p>
          <p className="mt-2 text-sm text-healthcare-400">
            Made by: Glenn, Dody, Ricko
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;