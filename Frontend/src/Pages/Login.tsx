import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Authentication logic will be implemented in future versions.');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <div className="w-11/12 max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>Sign In</h1>
            <p style={{ color: '#64748B' }}>Access your PublicVoice account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                  color: '#1E293B'
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
              <label htmlFor="password" className="block font-medium mb-2" style={{ color: '#1E293B' }}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg transition-colors"
                style={{ 
                  borderColor: '#CBD5E1',
                  color: '#1E293B'
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#0066CC';
                  e.currentTarget.style.boxShadow = '0 0 0 2px rgba(0, 102, 204, 0.2)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.boxShadow = 'none';
                }}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full px-8 py-4 text-white font-bold rounded-lg transition duration-300"
              style={{ backgroundColor: '#0066CC' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
            >
              Login
            </button>
          </form>
          <div className="mt-6 text-center">
            <p style={{ color: '#64748B' }}>
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-medium transition-colors"
                style={{ color: '#0066CC' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0052A3';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#0066CC';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 font-medium transition-colors"
              style={{ color: '#64748B' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#0066CC'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748B'}
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
