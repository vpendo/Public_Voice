import { Link } from 'react-router-dom';

export default function Services() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>Our Services</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            Empowering communities with innovative civic engagement tools
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">📋</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>Report Problems</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                Submit community issues with details, location, and evidence.
              </p>
              <img
                src="/home.jpg"
                alt="Reporting issues"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>Smart Categorization</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                Intelligent logic automatically routes reports to the right department.
              </p>
              <img
                src="/home.jpg"
                alt="Smart categorization"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl hover:shadow-2xl transition duration-300 border border-slate-200" style={{ borderTop: '4px solid #0066CC' }}>
              <div className="text-5xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>Track & Feedback</h3>
              <p className="mb-6" style={{ color: '#64748B' }}>
                Real-time status updates from submission to resolution.
              </p>
              <img
                src="/home.jpg"
                alt="Tracking progress"
                className="w-full h-48 object-cover rounded-lg mt-4"
              />
            </div>
          </div>
          <div className="text-center">
            <Link
              to="/report"
              className="inline-block px-10 py-4 text-white font-bold rounded-lg transition duration-300 shadow-xl"
              style={{ backgroundColor: '#0066CC' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0052A3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0066CC'}
            >
              Report a Problem
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
