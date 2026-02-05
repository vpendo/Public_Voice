export default function About() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
      <section className="bg-white py-20">
        <div className="w-11/12 mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>About PublicVoice</h1>
          <p className="text-xl max-w-2xl" style={{ color: '#64748B' }}>
            Transforming civic engagement through technology
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="w-11/12 mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="/home.jpg"
                alt="Community engagement"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold" style={{ color: '#1E293B' }}>Who We Are</h2>
              <p className="leading-relaxed text-lg" style={{ color: '#64748B' }}>
                PublicVoice is a civic-tech platform strengthening communication between citizens and local authorities through transparent, accessible channels.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6 order-2 lg:order-1">
              <h2 className="text-3xl font-bold" style={{ color: '#1E293B' }}>The Problem</h2>
              <ul className="space-y-4" style={{ color: '#64748B' }}>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>Lack of accessible reporting channels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>Reports ignored or undocumented</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>No transparency in issue resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-xl" style={{ color: '#0066CC' }}>✗</span>
                  <span>Limited accountability mechanisms</span>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src="/home.jpg"
                alt="Community challenges"
                className="w-full rounded-xl shadow-2xl object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>Our Mission</h2>
              <p className="leading-relaxed" style={{ color: '#64748B' }}>
                Empower citizens through technology by enabling transparent, inclusive, and accountable governance.
              </p>
            </div>
            <div className="bg-white p-10 rounded-xl shadow-xl border border-slate-200" style={{ borderLeft: '4px solid #0066CC' }}>
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#1E293B' }}>Our Vision</h2>
              <p className="leading-relaxed" style={{ color: '#64748B' }}>
                Communities where every voice is heard and acted upon through transparent collaboration.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
