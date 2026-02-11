import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { MessageSquare } from 'lucide-react';

interface ReportItem {
  id: number;
  name: string;
  title: string | null;
  category: string;
  status: string;
  created_at: string;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export function RespondList() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchReports() {
      try {
        const { data } = await apiClient.get<ReportItem[]>('/api/reports');
        if (!cancelled) setReports(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setError('Could not load reports.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReports();
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">Respond to Issues</h1>
      <p className="text-slate-500 mb-8">Select an issue to add or edit your response.</p>

      {loading && <p className="text-slate-500">Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && reports.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-[#0066CC]" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No issues to respond to</h2>
          <p className="text-slate-500">All reports are up to date or none have been submitted yet.</p>
        </div>
      )}

      {!loading && !error && reports.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">User</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Title</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Date</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-700">{r.title || `#${r.id}`}</td>
                    <td className="px-6 py-4 text-slate-600">{r.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          r.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">{formatDate(r.created_at)}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/respond/${r.id}`}
                        className="text-sm font-medium text-[#0066CC] hover:underline"
                      >
                        View / Respond
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