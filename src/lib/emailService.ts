import * as emailjs from '@emailjs/browser';
import { emailConfig, isEmailConfigured } from './emailConfig';

// Initialize EmailJS
if (isEmailConfigured()) {
  emailjs.init(emailConfig.publicKey);
}

export interface ConsultationEmailData {
  user_name: string;
  user_email: string;
  symptoms: string;
  consultation_summary: string;
}

export interface ContactEmailData {
  from_name: string;
  from_email: string;
  subject: string;
  message: string;
}

/**
 * Kirim notifikasi email untuk konsultasi baru
 */
export const sendConsultationEmail = async (data: ConsultationEmailData): Promise<boolean> => {
  if (!isEmailConfigured()) {
    console.warn('EmailJS belum dikonfigurasi. Baca SETUP_EMAIL.md untuk panduan setup.');
    return false;
  }

  try {
    const templateParams = {
      user_name: data.user_name,
      user_email: data.user_email,
      symptoms: data.symptoms,
      consultation_summary: data.consultation_summary,
      reply_to: data.user_email,
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateIds.consultation,
      templateParams
    );

    console.log('Email konsultasi terkirim:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('Gagal mengirim email konsultasi:', error);
    return false;
  }
};

/**
 * Kirim email dari form kontak
 */
export const sendContactEmail = async (data: ContactEmailData): Promise<boolean> => {
  if (!isEmailConfigured()) {
    console.warn('EmailJS belum dikonfigurasi. Baca SETUP_EMAIL.md untuk panduan setup.');
    return false;
  }

  try {
    const templateParams = {
      from_name: data.from_name,
      from_email: data.from_email,
      subject: data.subject,
      message: data.message,
      reply_to: data.from_email,
    };

    const response = await emailjs.send(
      emailConfig.serviceId,
      emailConfig.templateIds.contact,
      templateParams
    );

    console.log('Email kontak terkirim:', response.status, response.text);
    return response.status === 200;
  } catch (error) {
    console.error('Gagal mengirim email kontak:', error);
    return false;
  }
};

/**
 * Validasi apakah email service tersedia
 */
export const isEmailServiceAvailable = (): boolean => {
  return isEmailConfigured();
};
