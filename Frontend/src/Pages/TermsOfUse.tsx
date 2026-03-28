/** Terms of Use — PublicVoice civic reporting platform */
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <div className="w-11/12 max-w-[900px] mx-auto px-6 py-6 md:py-8 leading-[1.7]">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">PublicVoice Terms of Use</h1>
        <p className="mb-8">
          <strong>Last Updated:</strong> March 2026
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">1. Acceptance of Terms</h2>
        <p className="text-slate-700 mb-6">
          By using PublicVoice, users agree to comply with these Terms of Use and the Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">2. Service Description</h2>
        <p className="text-slate-700 mb-6">
          PublicVoice is a civic platform that allows users to report community issues. It is not an emergency response
          system.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">3. User Responsibilities</h2>
        <p className="text-slate-700 mb-6">
          Users must provide accurate, truthful, and lawful information when submitting reports.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">4. Prohibited Use</h2>
        <p className="text-slate-700 mb-6">
          Users must not submit false reports, unlawful content, abusive material, or attempt to misuse or disrupt the
          system.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">5. AI-Assisted Processing</h2>
        <p className="text-slate-700 mb-6">
          Reports may be processed using AI tools for classification and translation, with human review applied.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">6. Limitation of Liability</h2>
        <p className="text-slate-700 mb-6">
          PublicVoice does not guarantee resolution of reported issues and is not responsible for outcomes of
          administrative decisions.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">7. Account and Access Control</h2>
        <p className="text-slate-700 mb-6">
          The system may restrict or remove access in cases of misuse or violation of these terms.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-3">8. Changes to Terms</h2>
        <p className="text-slate-700 mb-6">
          These terms may be updated over time. Continued use of the platform indicates acceptance of changes.
        </p>

        <p className="text-slate-600 italic mt-10 mb-6">
          This document is provided for academic demonstration and does not constitute legal advice.
        </p>

        <p className="mt-6">
          <Link to="/privacy" className="text-[var(--color-primary)] font-medium hover:underline">
            Privacy Policy
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
