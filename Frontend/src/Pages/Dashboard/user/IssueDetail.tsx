import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';
import { ArrowLeft } from 'lucide-react';

interface ReportItem {
  id: number;
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

export function IssueDetail() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    async function fetchReport() {
      try {
        const { data } = await apiClient.get<ReportItem>(`/api/reports/${id}`);
        if (!cancelled) setReport(data);
      } catch {
        if (!cancelled) setError('Could not load this issue.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchReport();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error || !report) return <p className="text-red-600">{error || 'Not found'}</p>;

  const statusClass =
    report.status === 'resolved'
      ? 'bg-green-100 text-green-800'
      : report.status === 'rejected'
        ? 'bg-red-100 text-red-800'
        : 'bg-amber-100 text-amber-800';

  return (
    <div>
      <Link
        to="/user/issues"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0066CC] mb-6"
      >
        <ArrowLeft size={18} />
        Back to My Issues
      </Link>
      <h1 className="text-2xl font-bold text-slate-900 mb-2">
        {report.title || `Issue #${report.id}`}
      </h1>
      <p className="text-slate-500 mb-8">Submitted {formatDate(report.created_at)}</p>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Description
          </h2>
          <p className="text-slate-800 whitespace-pre-wrap">{report.raw_description}</p>
          <p className="mt-2 text-sm text-slate-500">Category: {report.category}</p>
          {report.location && (
            <p className="text-sm text-slate-500">Location: {report.location}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Status:</span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${statusClass}`}>
            {report.status}
          </span>
        </div>

        {report.admin_response && (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h2 className="text-sm font-semibold text-[#0066CC] uppercase tracking-wider mb-2">
              Response from authorities
            </h2>
            <p className="text-slate-800 whitespace-pre-wrap">{report.admin_response}</p>
          </div>
        )}
      </div>
    </div>
  );
}