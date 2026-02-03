import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { 
  getAllUsers, 
  getBroadcastContacts, 
  downloadContactsCSV, 
  copyPhonestoClipboard,
  getUserStats,
  formatPhoneDisplay,
  type BroadcastContact 
} from '../lib/userBroadcast';
import { FaDownload, FaCopy, FaWhatsapp, FaUsers, FaPhone, FaEnvelope } from 'react-icons/fa';

const BroadcastManager = () => {
  const [contacts, setContacts] = useState<BroadcastContact[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    usersWithPhone: 0,
    usersWithoutPhone: 0,
    registrationRate: '0'
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const broadcastContacts = getBroadcastContacts();
    setContacts(broadcastContacts);
    setStats(getUserStats());
  };

  const handleDownloadCSV = () => {
    downloadContactsCSV();
    alert('✅ File CSV berhasil didownload!');
  };

  const handleCopyPhones = async () => {
    const success = await copyPhonestoClipboard();
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } else {
      alert('❌ Gagal menyalin nomor telepon');
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healthcare-800 mb-2">
            Manajemen Broadcast WhatsApp
          </h1>
          <p className="text-gray-600">
            Kelola data kontak user untuk broadcast notifikasi kesehatan
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">Total User</p>
                <p className="text-3xl font-bold text-blue-800">{stats.totalUsers}</p>
              </div>
              <FaUsers className="text-4xl text-blue-400" />
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">User dengan No. HP</p>
                <p className="text-3xl font-bold text-green-800">{stats.usersWithPhone}</p>
              </div>
              <FaPhone className="text-4xl text-green-400" />
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-600 text-sm font-medium">Tanpa No. HP</p>
                <p className="text-3xl font-bold text-yellow-800">{stats.usersWithoutPhone}</p>
              </div>
              <FaEnvelope className="text-4xl text-yellow-400" />
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">% Registrasi Lengkap</p>
                <p className="text-3xl font-bold text-purple-800">{stats.registrationRate}%</p>
              </div>
              <FaWhatsapp className="text-4xl text-purple-400" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Export Data untuk Broadcast
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-3 bg-healthcare-600 text-white px-6 py-3 rounded-lg hover:bg-healthcare-700 transition-colors"
            >
              <FaDownload />
              Download File CSV
            </button>

            <button
              onClick={handleCopyPhones}
              className={`flex items-center justify-center gap-3 px-6 py-3 rounded-lg transition-colors ${
                copySuccess 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-600 text-white hover:bg-gray-700'
              }`}
            >
              <FaCopy />
              {copySuccess ? '✓ Tersalin!' : 'Copy Semua Nomor'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Petunjuk Broadcast:</strong>
            </p>
            <ul className="text-sm text-blue-700 mt-2 space-y-1">
              <li>• <strong>CSV:</strong> Import ke aplikasi WhatsApp Business API atau tools broadcast lainnya</li>
              <li>• <strong>Copy Nomor:</strong> Paste ke WhatsApp Web atau aplikasi broadcast pilihan Anda</li>
              <li>• Format nomor sudah E.164 (+628xxx) untuk kompatibilitas maksimal</li>
            </ul>
          </div>
        </div>

        {/* Search and Table */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Cari nama, nomor HP, atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">No</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nama</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nomor WhatsApp</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.length > 0 ? (
                  filteredContacts.map((contact, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{contact.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        <a 
                          href={`https://wa.me/${contact.phone.replace(/[\s\-\(\)\+]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:text-green-700 flex items-center gap-2"
                        >
                          <FaWhatsapp />
                          {formatPhoneDisplay(contact.phone)}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      {searchTerm ? 'Tidak ada hasil yang ditemukan' : 'Belum ada user yang terdaftar'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Menampilkan {filteredContacts.length} dari {contacts.length} kontak
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>ℹ️ Informasi Penting:</strong>
          </p>
          <ul className="text-sm text-yellow-700 mt-2 space-y-1">
            <li>• Data nomor telepon hanya untuk keperluan broadcast informasi kesehatan Puskesmas Wori</li>
            <li>• Pastikan pesan broadcast bermanfaat dan tidak spam</li>
            <li>• Hormati privasi user dengan tidak membagikan data ke pihak ketiga</li>
            <li>• Berikan opsi opt-out dalam setiap broadcast message</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default BroadcastManager;
