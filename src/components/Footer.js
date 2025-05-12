import React, { useState } from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission
    // For now, we'll just close the form and show an alert
    alert('Thank you for your feedback! We will review your suggestion.');
    setIsFormOpen(false);
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p className="copyright">
          © {currentYear} Fitness Journal. All rights reserved.
        </p>
        <p className="contact">
          Have suggestions?{' '}
          <button 
            className="contact-link" 
            onClick={() => setIsFormOpen(true)}
          >
            Contact Us
          </button>
        </p>
      </div>

      {isFormOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-button"
              onClick={() => setIsFormOpen(false)}
            >
              ×
            </button>
            <h3>Send us your suggestions</h3>
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
                />
              </div>
              <button type="submit" className="submit-button">
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer; 