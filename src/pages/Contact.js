import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs.production';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    subject: 'Fitness Journal Feedback'
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  // Verify EmailJS configuration on component mount
  useEffect(() => {
    console.log('Checking EmailJS configuration...');
    if (!EMAILJS_CONFIG.serviceId || !EMAILJS_CONFIG.templateId || !EMAILJS_CONFIG.publicKey) {
      console.error('EmailJS configuration is incomplete');
      setError('Email service configuration is missing');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    
    try {
      console.log('Attempting to send email...');
      
      const templateParams = {
        to_name: 'Admin',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email
      };

      console.log('Using config:', {
        serviceId: EMAILJS_CONFIG.serviceId,
        templateId: EMAILJS_CONFIG.templateId,
        publicKey: EMAILJS_CONFIG.publicKey
      });

      if (!EMAILJS_CONFIG.publicKey) {
        throw new Error('EmailJS public key is missing');
      }

      const response = await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        templateParams,
        EMAILJS_CONFIG.publicKey
      );

      console.log('Email sent successfully:', response);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        message: '',
        subject: 'Fitness Journal Feedback'
      });
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error('EmailJS error details:', err);
      let errorMessage = err.message || 'Unknown error';
      
      // Handle specific Gmail API errors
      if (err.text && err.text.includes('Gmail_API')) {
        errorMessage = 'Email service configuration error. Please contact the administrator.';
        console.error('Gmail API Error:', err.text);
      }
      
      setError(`Failed to send message: ${errorMessage}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page" style={{ maxWidth: 600, margin: '3rem auto', background: '#fff', borderRadius: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', padding: '2.5rem 2rem' }}>
      <h2 style={{ marginBottom: '1rem', color: '#2c3e50' }}>Contact Us</h2>
      <p style={{ marginBottom: '2rem', color: '#666' }}>Have suggestions or feedback? We'd love to hear from you!</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            placeholder="Subject of your message"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Type your message here..."
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={sending}
          style={{
            opacity: sending ? 0.7 : 1,
            cursor: sending ? 'not-allowed' : 'pointer'
          }}
        >
          {sending ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      
      {submitted && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#d4edda',
          color: '#155724',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          Thank you for your feedback! We'll get back to you soon.
        </div>
      )}
      
      {error && (
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default Contact; 