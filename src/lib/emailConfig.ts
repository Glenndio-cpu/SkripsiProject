// Email Service Configuration using EmailJS
// Dokumentasi: https://www.emailjs.com/docs/

export const emailConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  templateIds: {
    consultation: import.meta.env.VITE_EMAILJS_TEMPLATE_CONSULTATION || 'template_consultation',
    contact: import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT || 'template_contact',
  },
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
};

// Validasi konfigurasi
export const isEmailConfigured = () => {
  return (
    emailConfig.serviceId !== 'your_service_id' &&
    emailConfig.publicKey !== 'your_public_key'
  );
};
