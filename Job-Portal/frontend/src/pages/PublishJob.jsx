import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishJob } from '../api/jobs';

const initialForm = {
  title: '',
  description: '',
  location: '',
  salary: '',
  company: '',
  deadline: '',
  jobId: '',
};

function generateJobId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 6; i++) id += chars.charAt(Math.floor(Math.random() * chars.length));
  return id;
}

export default function PublishJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleGenerateId = () => {
    setForm((f) => ({ ...f, jobId: generateJobId() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.description || !form.location || !form.company || !form.jobId) {
      setError('Please fill title, description, location, company and job ID.');
      return;
    }
    if (form.jobId.length !== 6) {
      setError('Job ID must be exactly 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await publishJob({
        title: form.title,
        description: form.description,
        location: form.location,
        salary: form.salary ? Number(form.salary) : undefined,
        company: form.company,
        deadline: form.deadline || undefined,
        jobId: form.jobId,
      });
      navigate('/employer/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to publish job.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-slate-800">Publish a job</h1>
      <p className="text-slate-600 mt-1">Add a new opening for candidates to apply.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job title *</label>
          <input
            type="text"
            name="title"
            required
            maxLength={30}
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="e.g. Software Engineer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company *</label>
          <input
            type="text"
            name="company"
            required
            maxLength={60}
            value={form.company}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="Company name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Location *</label>
          <input
            type="text"
            name="location"
            required
            maxLength={30}
            value={form.location}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="e.g. Remote, Mumbai"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
          <textarea
            name="description"
            required
            maxLength={600}
            rows={4}
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
            placeholder="Job description and requirements..."
          />
          <p className="text-xs text-slate-500 mt-1">Max 600 characters.</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Salary (optional)</label>
          <input
            type="number"
            name="salary"
            min={0}
            value={form.salary}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="e.g. 800000"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Deadline (optional)</label>
          <input
            type="text"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            placeholder="e.g. 2025-04-30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Job ID * (exactly 6 characters)</label>
          <div className="flex gap-2">
            <input
              type="text"
              name="jobId"
              required
              minLength={6}
              maxLength={6}
              value={form.jobId}
              onChange={handleChange}
              className="flex-1 px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none uppercase"
              placeholder="ABC123"
            />
            <button
              type="button"
              onClick={handleGenerateId}
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              Generate
            </button>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
        )}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
          >
            {loading ? 'Publishing...' : 'Publish job'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/employer/dashboard')}
            className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
