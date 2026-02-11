import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { ArrowLeft, Send } from 'lucide-react';

interface ReportItem {
  id: number;
  name: string;
  title: string | null;
  raw_description: string;
  category: string;
  status: string;
  created_at: string;
  admin_response: string | null;
  location: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function Respond() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchReport() {
      try {
        const { data } = await apiClient.get<ReportItem>(`/api/reports/${id}`);
        if (!cancelled) {
          setReport(data);
          setResponse(data.admin_response ?? '');
          setStatus(data.status);
        }
      } catch {
        if (!cancelled) setError('Could not load this report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiClient.patch(`/api/reports/${id}`, {
        status: status || undefined,
        admin_response: response.trim() || undefined,
      });
      setSuccess(true);
      setReport((prev) =>
        prev ? { ...prev, status, admin_response: response.trim() || null } : null
      );
    } catch {
      setError('Failed to update report.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error && !report) return <p className="text-red-600">{error}</p>;
  if (!report) return null;

  return (
    <div>
      <Link
        to="/admin/issues"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0066CC] mb-6"
      >
        <ArrowLeft size={18} />
        Back to All Issues
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Respond to Issue</h1>
      <p className="text-slate-500 mb-8">
        {report.title || `Report #${report.id}`} · {report.name}
      </p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Citizen report
          </h2>
          <p className="text-slate-800 whitespace-pre-wrap">{report.raw_description}</p>
          <p className="mt-2 text-sm text-slate-500">Category: {report.category}</p>
          {report.location && (
            <p className="text-sm text-slate-500">Location: {report.location}</p>
          )}
          <p className="text-sm text-slate-500">Submitted: {formatDate(report.created_at)}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Your response</h2>
          {success && (
            <p className="mb-4 p-3 rounded-xl bg-green-50 text-green-800 text-sm">Response saved.</p>
          )}
          {error && (
            <p className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</p>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30"
              >
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label htmlFor="response" className="block text-sm font-medium text-slate-700 mb-1">
                Response to citizen
              </label>
              <textarea
                id="response"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 resize-none"
                placeholder="Write your response to the citizen..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-3 text-white font-semibold rounded-xl hover:opacity-90 disabled:opacity-70"
              style={{ backgroundColor: '#0066CC' }}
            >
              <Send size={18} />
              {submitting ? 'Saving...' : 'Save response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}