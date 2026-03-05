import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployerJobs, updateJob, deleteJob } from '../api/jobs';
import JobCard from '../components/JobCard';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchJobs = async () => {
    try {
      const { data } = await getEmployerJobs();
      setJobs(data.allJobs || []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load jobs.');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id);
    try {
      await updateJob(id, { status: newStatus });
      setJobs((prev) => prev.map((j) => (j._id === id ? { ...j, status: newStatus } : j)));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Update failed.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job? You can only delete closed jobs.')) return;
    setActionLoading(id);
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Delete failed.');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-600 mt-1">Welcome back, {user?.userName}.</p>
        </div>
        <Link
          to="/employer/publish"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
        >
          Publish new job
        </Link>
      </div>

      {error && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{error}</p>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-slate-800 mb-4">Your jobs</h2>
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
            <p className="text-slate-600">You haven't posted any jobs yet.</p>
            <Link
              to="/employer/publish"
              className="inline-block mt-4 text-primary-600 font-medium hover:underline"
            >
              Publish your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-slate-800">{job.title}</h3>
                    <p className="text-slate-600 font-medium mt-0.5">{job.company}</p>
                    {job.location && <p className="text-slate-500 text-sm mt-1">{job.location}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-slate-400">ID: {job.jobId}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {job.status === 'Open' ? (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(job._id, 'Closed')}
                        disabled={actionLoading === job._id}
                        className="px-3 py-1.5 rounded-lg border border-amber-300 text-amber-700 text-sm font-medium hover:bg-amber-50 disabled:opacity-50"
                      >
                        {actionLoading === job._id ? '...' : 'Close job'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(job._id, 'Open')}
                        disabled={actionLoading === job._id}
                        className="px-3 py-1.5 rounded-lg border border-green-300 text-green-700 text-sm font-medium hover:bg-green-50 disabled:opacity-50"
                      >
                        {actionLoading === job._id ? '...' : 'Reopen'}
                      </button>
                    )}
                    {job.status === 'Closed' && (
                      <button
                        type="button"
                        onClick={() => handleDelete(job._id)}
                        disabled={actionLoading === job._id}
                        className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
