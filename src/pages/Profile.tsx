import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import ImageCropModal from '../components/ImageCropModal';
import { hashPassword, verifyPassword } from '../lib/passwordUtils';
import { getUserStats } from '../lib/userActivityTracking';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<{ name: string; email: string; phone?: string; profileImage?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const [userStats, setUserStats] = useState({ consultationCount: 0, articlesReadCount: 0, activeDaysCount: 0 });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    // Cek apakah user sudah login
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);
    setProfileImage(parsedUser.profileImage || '');
    setFormData({
      ...formData,
      name: parsedUser.name,
      email: parsedUser.email,
      phone: parsedUser.phone || ''
    });

    // Load user statistics
    const stats = getUserStats();
    setUserStats(stats);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar!');
        return;
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran file maksimal 5MB!');
        return;
      }

      // Baca file dan tampilkan modal crop
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setTempImageUrl(base64String);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    
    // Reset input agar bisa upload file yang sama lagi
    e.target.value = '';
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setProfileImage(croppedImageUrl);
    
    // Simpan ke localStorage user session
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      profileImage: croppedImageUrl
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Update juga di users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].profileImage = croppedImageUrl;
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Trigger event untuk update header
    window.dispatchEvent(new Event('userUpdated'));
    
    alert('Foto profil berhasil diperbarui!');
  };

  const handleRemoveImage = () => {
    setProfileImage('');
    
    // Update localStorage user session
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = {
      ...currentUser,
      profileImage: ''
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    
    // Update juga di users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === currentUser.email);
    if (userIndex !== -1) {
      users[userIndex].profileImage = '';
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Trigger event untuk update header
    window.dispatchEvent(new Event('userUpdated'));
    
    alert('Foto profil berhasil dihapus!');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi nomor telepon jika diisi
    if (formData.phone) {
      const phoneRegex = /^[0-9]{10,15}$/;
      const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, '');
      if (!phoneRegex.test(cleanPhone)) {
        alert('Nomor telepon tidak valid (10-15 digit angka)');
        return;
      }
      
      // Cek apakah nomor telepon sudah digunakan akun lain
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const phoneExists = users.some((u: any) => u.phone === cleanPhone && u.email !== user?.email);
      
      if (phoneExists) {
        alert('Nomor telepon sudah terdaftar di akun lain!');
        return;
      }
    }
    
    // Update user data di session
    const cleanPhone = formData.phone ? formData.phone.replace(/[\s\-\(\)]/g, '') : '';
    const updatedUser = {
      ...user,
      name: formData.name,
      email: formData.email,
      phone: cleanPhone,
      profileImage: profileImage
    };
    
    // Update di localStorage user (session)
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update juga di users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === user?.email);
    
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        name: formData.name,
        email: formData.email,
        phone: cleanPhone,
        profileImage: profileImage
      };
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    setUser(updatedUser);
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleRemovePhone = () => {
    if (!window.confirm('Apakah Anda yakin ingin melepas nomor telepon dari akun ini?')) {
      return;
    }
    
    // Update user data
    const updatedUser = {
      ...user,
      phone: ''
    };
    
    // Update di localStorage user (session)
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    // Update juga di users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.email === user?.email);
    
    if (userIndex !== -1) {
      users[userIndex].phone = '';
      localStorage.setItem('users', JSON.stringify(users));
    }
    
    setUser(updatedUser);
    setFormData({ ...formData, phone: '' });
    
    // Trigger event untuk update header
    window.dispatchEvent(new Event('userUpdated'));
    
    alert('Nomor telepon berhasil dilepas dari akun!');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi password lama harus diisi
    if (!formData.currentPassword) {
      alert('Password saat ini harus diisi!');
      return;
    }
    
    // Validasi password baru
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Password baru dan konfirmasi password tidak sama!');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      alert('Password minimal 6 karakter!');
      return;
    }

    try {
      // Ambil data user dari localStorage users
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === user?.email);
      
      if (userIndex === -1) {
        alert('User tidak ditemukan!');
        return;
      }
      
      // Verifikasi password lama
      const isPasswordValid = await verifyPassword(formData.currentPassword, users[userIndex].password);
      
      if (!isPasswordValid) {
        alert('Anda memasukkan password yang salah!');
        return;
      }
      
      // Hash password baru
      const newHashedPassword = await hashPassword(formData.newPassword);
      
      // Update password di users array
      users[userIndex].password = newHashedPassword;
      localStorage.setItem('users', JSON.stringify(users));
      
      // Reset form
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      alert('✅ Password berhasil diubah!');
    } catch (error) {
      console.error('Change password error:', error);
      alert('❌ Terjadi kesalahan saat mengubah password!');
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      alert('Masukkan password untuk konfirmasi penghapusan akun!');
      return;
    }

    try {
      // Ambil data user dari localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.email === user?.email);
      
      if (userIndex === -1) {
        alert('User tidak ditemukan!');
        return;
      }
      
      // Verifikasi password
      const isPasswordValid = await verifyPassword(deleteConfirmPassword, users[userIndex].password);
      
      if (!isPasswordValid) {
        alert('Password salah! Penghapusan akun dibatalkan.');
        return;
      }
      
      // Hapus user dari array
      users.splice(userIndex, 1);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Hapus data aktivitas user
      const userActivities = JSON.parse(localStorage.getItem('userActivities') || '[]');
      const filteredActivities = userActivities.filter((activity: any) => activity.userEmail !== user?.email);
      localStorage.setItem('userActivities', JSON.stringify(filteredActivities));
      
      // Hapus session
      localStorage.removeItem('user');
      
      // Redirect ke halaman utama
      alert('✅ Akun berhasil dihapus. Terima kasih telah menggunakan layanan kami.');
      navigate('/');
      
    } catch (error) {
      console.error('Delete account error:', error);
      alert('❌ Terjadi kesalahan saat menghapus akun!');
    }
  };

  if (!user) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold text-healthcare-800 mb-8">Akun Saya</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
            {/* Profile Image Section */}
            <div className="relative mb-4 md:mb-0">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-healthcare-200"
                />
              ) : (
                <div className="w-32 h-32 bg-healthcare-100 rounded-full flex items-center justify-center text-5xl font-bold text-healthcare-600 border-4 border-healthcare-200">
                  {user.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-healthcare-600 text-white p-2 rounded-full hover:bg-healthcare-700 transition-colors shadow-lg"
                title="Upload foto"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            <div className="md:ml-6 text-center md:text-left flex-1">
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-600 mb-1">{user.email}</p>
              {user.phone && (
                <p className="text-gray-600 mb-3">
                  <span className="inline-flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {user.phone}
                  </span>
                </p>
              )}
              
              {/* Image Actions */}
              {profileImage && (
                <div className="flex gap-2 justify-center md:justify-start">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-healthcare-600 hover:text-healthcare-700 font-medium"
                  >
                    Ganti Foto
                  </button>
                  <span className="text-gray-400">|</span>
                  <button
                    onClick={handleRemoveImage}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Hapus Foto
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-healthcare-600 text-white px-6 py-2 rounded-lg hover:bg-healthcare-700 transition-colors"
            >
              Edit Profil
            </button>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                    placeholder="08123456789 atau +628123456789"
                  />
                  {formData.phone && (
                    <button
                      type="button"
                      onClick={handleRemovePhone}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                      title="Lepas nomor dari akun"
                    >
                      Lepas
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.phone ? 'Satu nomor hanya untuk satu akun' : 'Opsional - Nomor belum terdaftar'}
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-healthcare-600 text-white px-6 py-2 rounded-lg hover:bg-healthcare-700 transition-colors"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Ubah Password</h3>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password Saat Ini
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                placeholder="Masukkan password saat ini"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Password Baru
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                placeholder="Minimal 6 karakter"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-healthcare-500 focus:border-transparent outline-none"
                placeholder="Ketik ulang password baru"
              />
            </div>
            
            <button
              type="submit"
              className="bg-healthcare-600 text-white px-6 py-2 rounded-lg hover:bg-healthcare-700 transition-colors"
            >
              Ubah Password
            </button>
          </form>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-healthcare-600">{userStats.consultationCount}</div>
            <div className="text-gray-600 mt-2">Konsultasi</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-healthcare-600">{userStats.articlesReadCount}</div>
            <div className="text-gray-600 mt-2">Artikel Dibaca</div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-healthcare-600">{userStats.activeDaysCount}</div>
            <div className="text-gray-600 mt-2">Hari Aktif</div>
          </div>
        </div>

        {/* Danger Zone - Delete Account */}
        <div className="bg-white rounded-xl shadow-sm p-6 mt-6 border-2 border-red-200">
          <h3 className="text-xl font-semibold text-red-600 mb-4">⚠️ Zona Berbahaya</h3>
          <p className="text-gray-600 mb-4">
            Setelah menghapus akun, semua data Anda akan dihapus secara permanen. 
            Tindakan ini tidak dapat dibatalkan.
          </p>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Hapus Akun Saya
          </button>
        </div>

        {/* Delete Account Confirmation Dialog */}
        {showDeleteDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Akun?</h3>
                <p className="text-gray-600 mb-4">
                  Tindakan ini akan menghapus semua data Anda secara permanen:
                </p>
                <ul className="text-left text-sm text-gray-700 mb-4 space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Profil dan informasi akun</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Riwayat konsultasi ({userStats.consultationCount} konsultasi)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Riwayat artikel dibaca ({userStats.articlesReadCount} artikel)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>Aktivitas {userStats.activeDaysCount} hari</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Masukkan password untuk konfirmasi
                </label>
                <input
                  type="password"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Password akun Anda"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteDialog(false);
                    setDeleteConfirmPassword('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Batal
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Ya, Hapus Akun
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Crop Modal */}
        <ImageCropModal
          isOpen={isCropModalOpen}
          imageUrl={tempImageUrl}
          onClose={() => setIsCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      </div>
    </Layout>
  );
};

export default Profile;
