/** Privacy Policy — PublicVoice civic reporting platform */
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="w-11/12 max-w-[900px] mx-auto px-6 py-6 md:py-8 leading-[1.7]">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">PublicVoice Privacy Policy</h1>
        <p className="mb-8">
          <strong>Last Updated:</strong> March 2026
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">1. Data Collection</h2>
        <p className="text-slate-700 mb-6">
          PublicVoice collects personal information such as user account details, report content, and optional location
          data. This is necessary to support system functionality and civic reporting.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">2. Purpose of Data Use</h2>
        <p className="text-slate-700 mb-6">
          Collected data is used to process citizen reports, support administrative decision-making, and improve system
          performance.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">3. Data Access</h2>
        <p className="text-slate-700 mb-6">
          Submitted reports are accessible only to authorised administrators within the appropriate governance scope.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">4. Data Protection and Security</h2>
        <p className="text-slate-700 mb-6">
          User data is protected through secure storage, controlled access, and role-based permissions to prevent
          unauthorised access.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">5. User Rights</h2>
        <p className="text-slate-700 mb-6">
          Users have the right to provide consent, withdraw participation, and request correction or deletion of their
          data.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">6. AI Processing and Transparency</h2>
        <p className="text-slate-700 mb-6">
          PublicVoice uses AI to structure and classify reports. AI outputs are reviewed by human administrators to reduce
          bias and ensure fairness.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">7. Updates and Contact</h2>
        <p className="text-slate-700 mb-6">
          This policy may be updated as the system evolves. Users may contact the administrator for any concerns.
        </p>

        <p className="text-slate-600 italic mt-10 mb-6">
          This policy is provided for academic purposes and does not constitute legal advice.
        </p>

        <p className="mt-6">
          <Link to="/terms" className="text-[var(--color-primary)] font-medium hover:underline">
            Terms of Use
          </Link>
          <span className="mx-2 text-slate-300">|</span>
          <Link to="/" className="text-[var(--color-primary)] font-medium hover:underline">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
