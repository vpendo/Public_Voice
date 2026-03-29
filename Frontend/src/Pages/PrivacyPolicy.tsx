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
          PublicVoice collects only the minimum necessary personal information such as user account details, report
          content, and optional location data to support system functionality and civic reporting.
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
          User data is protected through secure storage, controlled access, and role-based permissions. Sensitive
          information is available only to authorised personnel within the appropriate governance scope.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">5. Data Retention</h2>
        <p className="text-slate-700 mb-6">
          Personal data is stored only for as long as necessary to support system functionality and evaluation. Data may
          be deleted upon user request or when no longer required.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">6. User Rights</h2>
        <p className="text-slate-700 mb-6">
          Users have the right to provide consent, withdraw participation, and request correction or deletion of their
          data.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">7. Consent</h2>
        <p className="text-slate-700 mb-6">
          By submitting information through PublicVoice, users confirm that participation is voluntary and based on
          informed consent.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">8. AI Processing and Transparency</h2>
        <p className="text-slate-700 mb-6">
          PublicVoice uses AI to structure and classify reports. AI outputs are reviewed by authorised human administrators
          before use to reduce bias, improve accuracy, and ensure responsible decision-making.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">9. Updates and Contact</h2>
        <p className="text-slate-700 mb-6">
          This policy may be updated as the system evolves. Users may contact the administrator for any concerns.
        </p>
        <p className="text-slate-700 mb-6">
          For privacy-related questions, users may contact the project administrator through the platform{' '}
          <Link to="/contact" className="font-medium text-[var(--color-primary)] hover:underline">
            Contact
          </Link>{' '}
          page or the contact details shown in the site footer.
        </p>

        <p className="text-slate-700 mb-6">
          These measures ensure that PublicVoice operates in a transparent, secure, and ethically responsible manner,
          protecting user rights while supporting civic engagement.
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
