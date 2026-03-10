import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getEmployerJobs, updateJob, deleteJob, getJobApplications, updateApplicationStatus } from '../api/jobs';
import JobCard from '../components/JobCard';

export default function EmployerDashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [appsByJob, setAppsByJob] = useState({});
  const [appsLoading, setAppsLoading] = useState(null);
  const [openApps, setOpenApps] = useState(null);

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

  const toggleApplications = async (jobId) => {
    if (openApps === jobId) {
      setOpenApps(null);
      return;
    }
    setOpenApps(jobId);
    if (appsByJob[jobId]) return;
    setAppsLoading(jobId);
    try {
      const { data } = await getJobApplications(jobId);
      setAppsByJob((prev) => ({ ...prev, [jobId]: data.jobApplicants || [] }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load applicants.');
    } finally {
      setAppsLoading(null);
    }
  };

  const handleApplicationStatus = async (applicationId, jobId, status) => {
    setActionLoading(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      setAppsByJob((prev) => ({
        ...prev,
        [jobId]: (prev[jobId] || []).map((a) => (a._id === applicationId ? { ...a, status } : a)),
      }));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update application.');
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
                    <button
                      type="button"
                      onClick={() => toggleApplications(job.jobId)}
                      disabled={appsLoading === job.jobId}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 disabled:opacity-50"
                    >
                      {appsLoading === job.jobId ? '...' : openApps === job.jobId ? 'Hide applicants' : 'View applicants'}
                    </button>
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

                {openApps === job.jobId && (
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <h4 className="text-sm font-semibold text-slate-800">Applicants</h4>
                    {(appsByJob[job.jobId] || []).length === 0 ? (
                      <p className="text-sm text-slate-500 mt-2">No applications yet.</p>
                    ) : (
                      <div className="mt-3 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="text-left text-slate-500">
                              <th className="py-2 pr-4 font-medium">Name</th>
                              <th className="py-2 pr-4 font-medium">Email</th>
                              <th className="py-2 pr-4 font-medium">Status</th>
                              <th className="py-2 pr-4 font-medium">Resume</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(appsByJob[job.jobId] || []).map((a) => (
                              <tr key={a._id}>
                                <td className="py-2 pr-4 text-slate-800">{a.name || '-'}</td>
                                <td className="py-2 pr-4 text-slate-700">{a.email}</td>
                                <td className="py-2 pr-4">
                                  <select
                                    value={a.status || 'Pending'}
                                    disabled={actionLoading === a._id}
                                    onChange={(e) => handleApplicationStatus(a._id, job.jobId, e.target.value)}
                                    className="px-2 py-1 rounded-md border border-slate-300 bg-white text-slate-700 text-sm disabled:opacity-50"
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Short-listed">Short-listed</option>
                                    <option value="Rejected">Rejected</option>
                                  </select>
                                </td>
                                <td className="py-2 pr-4">
                                  {a.resume?.url ? (
                                    <a
                                      href={a.resume.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-primary-600 font-medium hover:underline"
                                    >
                                      View
                                    </a>
                                  ) : (
                                    <span className="text-slate-400">-</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
