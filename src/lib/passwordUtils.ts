/**
 * Simple password hashing utility
 * CATATAN: Ini hanya untuk demo/development
 * Untuk production, gunakan bcrypt di backend!
 */

/**
 * Hash password menggunakan simple algorithm
 * Di production, gunakan bcrypt atau argon2 di backend
 */
export const hashPassword = async (password: string): Promise<string> => {
  // Convert string to ArrayBuffer
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // Hash using SHA-256
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  
  // Convert to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};

/**
 * Verify password dengan hash yang tersimpan
 */
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hashedPassword;
};

/**
 * Generate random salt (untuk enhancement di masa depan)
 */
export const generateSalt = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};
