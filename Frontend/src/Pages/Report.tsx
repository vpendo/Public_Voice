import { useState } from 'react';

export default function Report() {
  const [formData, setFormData] = useState({
    description: '',
    category: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Thank you for your report! Your issue has been submitted. (Note: Backend integration will be implemented in future versions.)');
    setFormData({ description: '', category: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>Report a Problem</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            Help improve your community by reporting issues
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200">
                <h2 className="text-2xl font-bold mb-6" style={{ color: '#1E293B' }}>Describe Your Issue</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="category" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
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
                    >
                      <option value="">Select a category</option>
                      <option value="roads">Roads & Infrastructure</option>
                      <option value="water">Water Supply</option>
                      <option value="security">Security & Safety</option>
                      <option value="sanitation">Sanitation & Waste</option>
                      <option value="electricity">Electricity</option>
                      <option value="health">Health Services</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                      Describe Problem
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={8}
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
                      placeholder="Please provide details about the issue, including location, severity, and any other relevant information..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 text-white font-bold rounded-lg transition duration-300"
                    style={{ backgroundColor: '#0066CC' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
                  >
                    Submit Report
                  </button>
                </form>

                
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#1E293B' }}>Why Report?</h3>
                <ul className="space-y-3 text-sm" style={{ color: '#64748B' }}>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#0066CC' }}>✓</span>
                    <span>Help authorities prioritize issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#0066CC' }}>✓</span>
                    <span>Track progress in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span style={{ color: '#0066CC' }}>✓</span>
                    <span>Improve your community</span>
                  </li>
                </ul>
              </div>
              <div>
                <img
                  src="/home.jpg"
                  alt="Report issues"
                  className="w-full rounded-xl shadow-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
