import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPublicJobs } from '../api/jobs';
import { applyToJob } from '../api/employee';

export default function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPublicJobs();
        const list = res.data?.jobs ?? res.data?.allJobs ?? [];
        const arr = Array.isArray(list) ? list : [];
        const found = arr.find((j) => (j.jobId || j._id) === jobId) || arr.find((j) => j._id === jobId);
        if (!cancelled) setJob(found || null);
      } catch {
        if (!cancelled) setJob(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [jobId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name) {
      setError('Name is required.');
      return;
    }
    if (!form.email) {
      setError('Email is required.');
      return;
    }
    if (!file) {
      setError('Please select your resume (PDF or DOC).');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('email', form.email);
      formData.append('resume', file);
      await applyToJob(jobId, formData);
      navigate('/employee/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Application failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-slate-800">
        {job ? `Apply to ${job.title}` : 'Apply to job'}
      </h1>
      <p className="text-slate-600 mt-1">
        {job ? `${job.company} · ${job.location}` : `Job ID: ${jobId}`}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Resume (PDF or DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword"
            required
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700"
          />
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {submitting ? 'Submitting...' : 'Submit application'}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
        {!job && (
          <p className="text-sm text-slate-500 mt-2">
            <button type="button" onClick={() => navigate('/jobs')} className="text-primary-600 hover:underline">
              Back to jobs
            </button>
          </p>
        )}
      </form>
    </div>
  );
}
