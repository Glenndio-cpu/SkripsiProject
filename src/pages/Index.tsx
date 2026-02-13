import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Pill, Apple, Activity, MessageCircle, BookOpen, Shield, ArrowRight, Heart, Stethoscope, Users, CheckCircle, Clock, Sparkles } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="animate-fade-in -mx-4 -mt-4">

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Text */}
              <div className="text-center lg:text-left order-2 lg:order-1">
                <span className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6 border border-sky-100">
                  <Heart className="w-4 h-4" />
                  Layanan Kesehatan Digital
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold text-slate-700 leading-tight mb-5">
                  Puskesmas Wori{' '}
                  <span className="text-sky-500">Online</span>
                </h1>
                <p className="text-base sm:text-lg text-slate-500 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  Chatbot Pendamping Puskesmas Sebagai Inovasi Layanan Kesehatan Desa Wori Menggunakan Whatsapp Gateway Terintegrasi RAG dan LLM
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                  <Link
                    to="/konsultasi"
                    className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-sky-600 transition-colors duration-200"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Layanan Chatbot
                  </Link>
                  <Link
                    to="/penyakit"
                    className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-7 py-3.5 rounded-xl font-semibold hover:border-sky-300 hover:text-sky-600 transition-colors duration-200"
                  >
                    Pelajari Lebih Lanjut
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mt-10 max-w-md mx-auto lg:mx-0">
                  {[
                    { value: '24/7', label: 'Layanan Online' },
                    { value: 'AI', label: 'Chatbot Cerdas' },
                    { value: 'Gratis', label: 'Untuk Semua' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center lg:text-left">
                      <p className="text-2xl sm:text-3xl font-bold text-sky-500">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Right Image */}
              <div className="flex justify-center order-1 lg:order-2">
                <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
                  <img
                    src="https://img.freepik.com/free-vector/doctors-concept-illustration_114360-1515.jpg"
                    alt="Tim Dokter Puskesmas Wori"
                    className="w-full rounded-2xl shadow-lg border border-slate-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== FEATURES SECTION ==================== */}
        <section className="bg-slate-50 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Fitur Utama</h2>
              <p className="text-slate-400 mt-2 max-w-lg mx-auto">Temukan manfaat menggunakan Puskesmas Wori Online untuk kebutuhan kesehatan Anda</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {[
                { icon: Pill, title: 'Rekomendasi Obat', desc: 'Dapatkan rekomendasi obat yang sesuai dengan gejala dan kondisi kesehatan Anda secara cepat dan akurat.' },
                { icon: Apple, title: 'Saran Konsumsi', desc: 'Informasi makanan yang sebaiknya dikonsumsi atau dihindari saat Anda sedang dalam kondisi sakit.' },
                { icon: Activity, title: 'Info Penyakit', desc: 'Informasi lengkap tentang berbagai penyakit menular dan tidak menular, gejala, serta pencegahannya.' },
              ].map((item, i) => (
                <div key={i} className={`group bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors duration-200 ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                  <div className="w-14 h-14 bg-sky-50 rounded-xl flex items-center justify-center mb-5 group-hover:bg-sky-500 transition-colors duration-200">
                    <item.icon className="w-7 h-7 text-sky-500 group-hover:text-white transition-colors duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Cara Menggunakan</h2>
              <p className="text-slate-400 mt-2 max-w-lg mx-auto">Tiga langkah mudah untuk mulai menggunakan layanan kesehatan digital kami</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {[
                { step: '1', icon: Users, title: 'Daftar Akun', desc: 'Buat akun gratis untuk mengakses semua layanan kesehatan digital kami.' },
                { step: '2', icon: MessageCircle, title: 'Mulai Konsultasi', desc: 'Ceritakan keluhan Anda melalui chatbot AI yang tersedia 24/7.' },
                { step: '3', icon: Stethoscope, title: 'Dapatkan Saran', desc: 'Terima rekomendasi kesehatan berdasarkan analisis AI yang akurat.' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="relative mb-5">
                    <div className="w-16 h-16 bg-sky-500 rounded-2xl flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-7 h-7 bg-white border-2 border-sky-500 text-sky-500 rounded-full text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-700 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US ==================== */}
        <section className="bg-slate-50 py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-700 mb-4">Mengapa Memilih Layanan Kami?</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Kami menggabungkan teknologi AI terbaru dengan pengetahuan medis untuk memberikan layanan kesehatan yang mudah diakses oleh seluruh masyarakat Desa Wori.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: CheckCircle, text: 'Informasi kesehatan terverifikasi dan akurat' },
                    { icon: Clock, text: 'Tersedia 24 jam setiap hari tanpa batas waktu' },
                    { icon: Shield, text: 'Data pengguna terjamin keamanannya' },
                    { icon: Sparkles, text: 'Didukung teknologi AI Gemini terbaru' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <item.icon className="w-4 h-4 text-sky-500" />
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { number: '500+', label: 'Pengguna Aktif', icon: Users },
                  { number: '1000+', label: 'Konsultasi AI', icon: MessageCircle },
                  { number: '24/7', label: 'Dukungan Online', icon: Clock },
                  { number: '100%', label: 'Gratis Diakses', icon: Heart },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 rounded-xl border border-slate-100 text-center">
                    <stat.icon className="w-6 h-6 text-sky-500 mx-auto mb-2" />
                    <p className="text-xl font-bold text-slate-700">{stat.number}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ==================== SDGs SECTION ==================== */}
        <section className="bg-white py-14 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-700">Mendukung SDGs</h2>
              <p className="text-slate-400 mt-2 max-w-lg mx-auto">Kontribusi kami untuk Tujuan Pembangunan Berkelanjutan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
              {/* SDG 3 */}
              <a
                href="https://sdgs.un.org/goals/goal3"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-sky-500 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  3
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">Good Health and Well-being</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Memastikan kehidupan yang sehat dan mendorong kesejahteraan bagi semua orang pada segala usia.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sky-500 text-sm font-medium mt-3 group-hover:gap-2 transition-all duration-200">
                    Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>

              {/* SDG 12 */}
              <a
                href="https://sdgs.un.org/goals/goal12"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 hover:border-sky-200 transition-colors duration-200"
              >
                <div className="w-16 h-16 rounded-2xl bg-slate-700 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  12
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">Responsible Consumption & Production</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Memastikan pola konsumsi dan produksi yang berkelanjutan, termasuk dalam konteks layanan kesehatan.
                  </p>
                  <span className="inline-flex items-center gap-1 text-sky-500 text-sm font-medium mt-3 group-hover:gap-2 transition-all duration-200">
                    Pelajari Lebih Lanjut <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="bg-slate-700 py-14 md:py-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Shield className="w-12 h-12 text-sky-400 mx-auto mb-5" />
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Mulai Konsultasi Sekarang</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto leading-relaxed">
              Jangan tunda kesehatan Anda. Gunakan chatbot AI kami untuk mendapatkan informasi kesehatan yang cepat, akurat, dan terpercaya.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link
                to="/konsultasi"
                className="inline-flex items-center justify-center gap-2 bg-sky-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-sky-400 transition-colors duration-200"
              >
                <MessageCircle className="w-5 h-5" />
                Mulai Chat
              </Link>
              <Link
                to="/tentang"
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-500 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-slate-600 transition-colors duration-200"
              >
                Tentang Kami
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Index;