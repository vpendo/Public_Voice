import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Report a Problem</h1>
          <p className="text-xl text-slate-200 max-w-2xl">
            Help improve your community by reporting issues
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6">Describe Your Issue</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="category" className="block text-slate-200 font-medium mb-2">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                    <label htmlFor="description" className="block text-slate-200 font-medium mb-2">
                      Describe Problem
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={8}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Please provide details about the issue, including location, severity, and any other relevant information..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition duration-300"
                  >
                    Submit Report
                  </button>
                </form>

               
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Why Report?</h3>
                <ul className="space-y-3 text-slate-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>Help authorities prioritize issues</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
                    <span>Track progress in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">✓</span>
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
