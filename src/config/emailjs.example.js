import { init } from '@emailjs/browser';

// Initialize EmailJS with your public key
init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);

// Email template configuration
export const EMAILJS_CONFIG = {
  serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID,
  templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY
}; 