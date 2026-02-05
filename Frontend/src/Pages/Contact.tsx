import { useState } from 'react';
import { Mail, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon. (Note: Backend integration will be implemented in future versions.)');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>Contact Us</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            Get in touch with our team
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200">
              <h2 className="text-2xl font-bold mb-8" style={{ color: '#1E293B' }}>Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: '#CBD5E1',
                      color: '#1E293B',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0066CC';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 102, 204, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: '#CBD5E1',
                      color: '#1E293B',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0066CC';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 102, 204, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: '#CBD5E1',
                      color: '#1E293B',
                      backgroundColor: 'white'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#0066CC';
                      e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 102, 204, 0.2)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    placeholder="Your message here..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full px-8 py-4 text-white font-bold rounded-lg transition duration-300 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#0066CC' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                >
                  <Send size={20} />
                  Send Message
                </button>
              </form>
            </div>

            <div className="space-y-8">
              <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E293B' }}>Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#0066CC' }}>
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: '#1E293B' }}>Email</h3>
                      <a
                        href="mailto:contact@publicvoice.org"
                        className="transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                      >
                        contact@publicvoice.org
                      </a>
                      <br />
                      <a
                        href="mailto:support@publicvoice.org"
                        className="transition-colors"
                        style={{ color: '#64748B' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
                      >
                        support@publicvoice.org
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: '#0066CC' }}>
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1" style={{ color: '#1E293B' }}>Location</h3>
                      <p style={{ color: '#64748B' }}>Serving communities in Rwanda</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <img
                  src="/home.jpg"
                  alt="Contact us"
                  className="w-full rounded-xl shadow-xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
