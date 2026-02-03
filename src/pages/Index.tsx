import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in">
        <section className="bg-gradient-to-b from-healthcare-100 to-white p-8 rounded-xl shadow-sm mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-healthcare-800 mb-4">Puskesmas Wori Online</h1>
            <p className="text-xl text-healthcare-700 mb-6">
              Chatbot Pendamping Puskesmas Sebagai Inovasi Layanan Kesehatan Desa Wori Menggunakan
Whatsapp Gateway Terintegrasi RAG DAN LLM

            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/konsultasi" 
                className="bg-healthcare-600 text-white px-6 py-3 rounded-lg hover:bg-healthcare-700 transition-colors"
              >
                Layanan Chatbot
              </Link>
              <Link 
                to="/penyakit"
                className="bg-white text-healthcare-700 border border-healthcare-300 px-6 py-3 rounded-lg hover:bg-healthcare-50 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </section>
        
        <div className="flex justify-center my-8">
          <img 
            src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg" 
            alt="Doctors Illustration" 
            className="w-full max-w-lg rounded-lg shadow-lg" 
          />
        </div>
		<section className="bg-healthcare-50 p-8 rounded-xl mb-12">
		  <div className="text-center mb-8">
			<h2 className="text-3xl font-bold text-healthcare-800">Mendukung SDGs</h2>
			<p className="text-gray-600 mt-2">Kontribusi kami untuk Tujuan Pembangunan Berkelanjutan</p>
		  </div>
		  <div className="max-w-4xl mx-auto">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
			  {/* SDG 3 Box */}
			  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
				<div className="flex items-start mb-4">
				  <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-2xl font-bold mr-4 flex-shrink-0">3</div>
				  <div>
					<h3 className="text-xl font-semibold mb-2 text-healthcare-700">Good Health and Well-being</h3>
					<p className="text-gray-600">
					  Memastikan kehidupan yang sehat dan mendorong kesejahteraan bagi semua orang pada segala usia.
					</p>
				  </div>
				</div>
				<div className="mt-auto flex justify-center">
				  <a 
					href="https://sdgs.un.org/goals/goal3" 
					target="_blank"
					rel="noopener noreferrer"
					className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
				  >
					SDG 3: Kesehatan
				  </a>
				</div>
			  </div>
			  {/* SDG 12 Box */}
			  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
				<div className="flex items-start mb-4">
				  <div className="w-16 h-16 rounded-full bg-amber-600 flex items-center justify-center text-white text-2xl font-bold mr-4 flex-shrink-0">12</div>
				  <div>
					<h3 className="text-xl font-semibold mb-2 text-healthcare-700">Responsible Consumption & Production</h3>
					<p className="text-gray-600">
					  Memastikan pola konsumsi dan produksi yang berkelanjutan, termasuk dalam konteks kesehatan.
					</p>
				  </div>
				</div>
				<div className="mt-auto flex justify-center">
				  <a 
					href="https://sdgs.un.org/goals/goal12" 
					target="_blank"
					rel="noopener noreferrer"
					className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-center"
				  >
					SDG 12: Konsumsi Berkelanjutan
				  </a>
				</div>
			  </div>
			</div>
		  </div>
		</section>
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-healthcare-800">Fitur Utama</h2>
            <p className="text-gray-600 mt-2">Temukan manfaat menggunakan Puskesmas Wori Online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-semibold mb-2 text-healthcare-700">Rekomendasi Obat</h3>
              <p className="text-gray-600">
                Dapatkan rekomendasi obat yang sesuai dengan gejala dan kondisi kesehatan Anda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🍎</div>
              <h3 className="text-xl font-semibold mb-2 text-healthcare-700">Saran Konsumsi</h3>
              <p className="text-gray-600">
                Informasi makanan yang sebaiknya dikonsumsi atau dihindari saat Anda sakit.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="text-4xl mb-4">🦠</div>
              <h3 className="text-xl font-semibold mb-2 text-healthcare-700">Info Penyakit</h3>
              <p className="text-gray-600">
                Informasi lengkap tentang berbagai penyakit menular dan tidak menular, gejala, dan pencegahannya.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;