/**
 * Utility functions untuk mengelola data user dan broadcast WhatsApp
 */

export interface UserData {
  email: string;
  name: string;
  phone: string;
  password: string;
  profileImage?: string;
  createdAt: string;
  role?: string; // 'patient' or 'nurse'
}

/**
 * Ambil semua user yang terdaftar
 */
export function getAllUsers(): UserData[] {
  try {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error loading users:', error);
    return [];
  }
}

/**
 * Ambil semua nomor telepon user untuk broadcast
 * Format: E.164 (untuk WhatsApp API)
 */
export function getAllPhoneNumbers(): string[] {
  const users = getAllUsers();
  return users
    .map(user => user.phone)
    .filter(phone => phone && phone.length > 0);
}

/**
 * Ambil data user dengan nomor telepon (untuk broadcast dengan nama)
 */
export interface BroadcastContact {
  name: string;
  phone: string;
  email: string;
}

export function getBroadcastContacts(): BroadcastContact[] {
  const users = getAllUsers();
  return users
    .filter(user => user.phone && user.phone.length > 0)
    .map(user => ({
      name: user.name,
      phone: user.phone,
      email: user.email
    }));
}

/**
 * Export nomor telepon ke format CSV untuk import ke aplikasi broadcast
 */
export function exportPhonesToCSV(): string {
  const contacts = getBroadcastContacts();
  
  // Header CSV
  let csv = 'Nama,Nomor WhatsApp,Email\n';
  
  // Data rows
  contacts.forEach(contact => {
    csv += `"${contact.name}","${contact.phone}","${contact.email}"\n`;
  });
  
  return csv;
}

/**
 * Download file CSV ke komputer
 */
export function downloadContactsCSV(): void {
  const csv = exportPhonesToCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `puskesmas-wori-contacts-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export nomor telepon ke format untuk WhatsApp Web Multi-device
 * Format: +6281234567890,+6281234567891,+6281234567892
 */
export function exportPhonesForWhatsApp(): string {
  const phones = getAllPhoneNumbers();
  // Pastikan format E.164
  return phones
    .map(phone => {
      // Jika belum ada +, tambahkan
      if (!phone.startsWith('+')) {
        // Jika dimulai 08, ganti jadi +628
        if (phone.startsWith('08')) {
          return '+62' + phone.substring(1);
        }
        // Jika dimulai 62, tambahkan +
        if (phone.startsWith('62')) {
          return '+' + phone;
        }
        // Default tambahkan +62
        return '+62' + phone;
      }
      return phone;
    })
    .join(',');
}

/**
 * Copy nomor telepon ke clipboard untuk paste ke WhatsApp
 */
export async function copyPhonestoClipboard(): Promise<boolean> {
  try {
    const phones = exportPhonesForWhatsApp();
    await navigator.clipboard.writeText(phones);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
}

/**
 * Get statistik user
 */
export function getUserStats() {
  const users = getAllUsers();
  const usersWithPhone = users.filter(u => u.phone && u.phone.length > 0);
  
  return {
    totalUsers: users.length,
    usersWithPhone: usersWithPhone.length,
    usersWithoutPhone: users.length - usersWithPhone.length,
    registrationRate: users.length > 0 
      ? ((usersWithPhone.length / users.length) * 100).toFixed(1)
      : '0'
  };
}

/**
 * Format nomor telepon untuk display
 */
export function formatPhoneDisplay(phone: string): string {
  // Dari: 628123456789
  // Jadi: +62 812-3456-789
  if (!phone) return '';
  
  let formatted = phone;
  
  // Pastikan ada +
  if (!formatted.startsWith('+')) {
    if (formatted.startsWith('0')) {
      formatted = '+62' + formatted.substring(1);
    } else if (formatted.startsWith('62')) {
      formatted = '+' + formatted;
    } else {
      formatted = '+62' + formatted;
    }
  }
  
  // Format dengan spasi dan dash
  // +62 812-3456-789
  if (formatted.startsWith('+62')) {
    const number = formatted.substring(3);
    if (number.length >= 9) {
      return `+62 ${number.substring(0, 3)}-${number.substring(3, 7)}-${number.substring(7)}`;
    }
  }
  
  return formatted;
}

/**
 * Validasi nomor telepon Indonesia
 */
export function isValidIndonesianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, '');
  
  // Harus 10-15 digit
  if (cleaned.length < 10 || cleaned.length > 15) {
    return false;
  }
  
  // Hanya angka
  if (!/^[0-9]+$/.test(cleaned)) {
    return false;
  }
  
  // Harus dimulai 08, 62, atau 8 (setelah +62)
  if (!cleaned.startsWith('08') && !cleaned.startsWith('62') && !cleaned.startsWith('8')) {
    return false;
  }
  
  return true;
}
