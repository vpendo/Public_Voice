import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { FileText } from 'lucide-react';

interface ReportItem {
  id: number;
  title: string | null;
  raw_description: string;
  category: string;
  status: string;
  created_at: string;
  admin_response: string | null;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function statusBadge(status: string) {
  const s = status.toLowerCase();
  const styles =
    s === 'resolved'
      ? 'bg-green-100 text-green-800'
      : s === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-amber-100 text-amber-800';
  return <span className={`text-xs font-medium px-2 py-1 rounded-full ${styles}`}>{status}</span>;
}

export function MyIssues() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports/mine');
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load your issues.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">My Issues</h1>
      <p className="text-slate-500 mb-8">Track your submitted reports and see responses.</p>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-[#0066CC]" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No issues yet</h2>
          <p className="text-slate-500 mb-6">Submit your first issue from the Submit Issue page.</p>
          <Link
            to="/user/submit"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium"
            style={{ backgroundColor: '#0066CC' }}
          >
            Submit Issue
          </Link>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-slate-900">
                        {r.title || r.raw_description.slice(0, 50) || `#${r.id}`}
                        {!r.title && r.raw_description.length > 50 ? '...' : ''}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4">{statusBadge(r.status)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/user/issues/${r.id}`}
                        className="text-sm font-medium text-[#0066CC] hover:underline"
                      >
                        View details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}