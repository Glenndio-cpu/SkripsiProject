import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { sendContactEmail, isEmailServiceAvailable } from '../lib/emailService';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react';

const Kontak = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setSubmitStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Semua field harus diisi!');
      return;
    }

    // Validasi email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Format email tidak valid!');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Kirim email
      const emailSent = await sendContactEmail({
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message
      });

      if (emailSent) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-600">Kontak Kami</h1>
        
        {/* Email Service Status Warning */}
        {!isEmailServiceAvailable() && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
            <p className="font-bold">Pemberitahuan</p>
            <p>Email notification belum dikonfigurasi. Pesan akan tetap terkirim di form, tapi tidak akan dikirim ke email admin. Baca file <code>SETUP_EMAIL.md</code> untuk setup.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4"></div>
            <h2 className="text-xl font-semibold mb-2 text-slate-600">Kirim Pesan</h2>
            <p className="text-gray-600 mb-6">
              Punya pertanyaan atau masukan? Jangan ragu untuk menghubungi tim kami.
            </p>
            
            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                 Pesan berhasil dikirim! Admin akan segera menghubungi Anda via email.
              </div>
            )}
            
            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                 Gagal mengirim pesan. Silakan coba lagi atau hubungi kami via WhatsApp.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="nama@email.com"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subjek
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Topik pesan Anda"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Tulis pesan Anda di sini..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-sky-500 text-white px-4 py-2 rounded hover:bg-slate-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="inline-block animate-spin mr-2 w-4 h-4" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="inline-block mr-2 w-4 h-4" /> Kirim Pesan
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-4xl mb-4"><Phone className="w-10 h-10 text-sky-500" /></div>
            <h2 className="text-xl font-semibold mb-4 text-slate-600">Informasi Kontak</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-6 h-6 mr-3 text-sky-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 font-bold">Email</h3>
                  <p className="text-gray-700">{import.meta.env.VITE_PUSKESMAS_EMAIL || 'puskesmas.desawori@gmail.com'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-6 h-6 mr-3 text-sky-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 font-bold">Telepon</h3>
                  <p className="text-gray-700">{import.meta.env.VITE_PUSKESMAS_PHONE || '+62 896-5739-8733'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="w-6 h-6 mr-3 text-sky-500 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900 font-bold">Alamat</h3>
                  <p className="text-gray-700">
                    Puskemas Desa Wori<br />
                    Manado, Indonesia
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
			  <h3 className="text-lg font-medium mb-4 text-slate-600">Ikuti Kami</h3>
			  <div className="flex flex-col space-y-5">
				<a href="#" className="group flex items-center gap-3">
				  <div className="text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-110">
					<FaFacebook size={24} />
				  </div>
				  <span className="text-sm font-medium text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-105">
					Facebook
				  </span>
				</a>
				<a href="#" className="group flex items-center gap-3">
				  <div className="text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-110">
					<FaInstagram size={24} />
				  </div>
				  <span className="text-sm font-medium text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-105">
					Instagram
				  </span>
				</a>
				<a href="#" className="group flex items-center gap-3">
				  <div className="text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-110">
					<FaXTwitter size={24} />
				  </div>
				  <span className="text-sm font-medium text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-105">
					X
				  </span>
				</a>
				<a href="#" className="group flex items-center gap-3">
				  <div className="text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-110">
					<FaYoutube size={24} />
				  </div>
				  <span className="text-sm font-medium text-sky-500 group-hover:text-slate-700 transition-all duration-200 group-hover:scale-105">
					YouTube
				  </span>
				</a>
			  </div>
			</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Kontak;