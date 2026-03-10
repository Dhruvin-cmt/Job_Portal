import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicJobs } from '../api/jobs';
import JobCard from '../components/JobCard';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isEmployee } = useAuth();

  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');

  useEffect(() => {
    let cancelled = false;
    const q = searchParams.get('q') || '';
    const loc = searchParams.get('location') || '';

    (async () => {
      setLoading(true);
      try {
        const params = {};
        if (q.trim()) params.q = q.trim();
        if (loc.trim()) params.location = loc.trim();

        const res = await getPublicJobs(params);
        const list = res.data?.jobs ?? res.data?.allJobs ?? [];
        if (!cancelled) {
          setJobs(Array.isArray(list) ? list : []);
          setError('');
        }
      } catch (e) {
        if (!cancelled) {
          setJobs([]);
          setError(e.message || 'Could not load jobs.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    if (location.trim()) params.set('location', location.trim());
    navigate(`/jobs?${params.toString()}`, { replace: false });
    setSearch("")
    setLocation("")
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800">Browse Jobs</h1>
      <p className="text-slate-600 mt-1">Search and filter open positions.</p>

      <form
        onSubmit={handleSearchSubmit}
        className="mt-6 grid grid-cols-1 sm:grid-cols-[2fr,1.5fr,auto] gap-3 items-end"
      >
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Title, company, job ID, or keyword</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="e.g. Frontend Developer, React, Infosys, JOB123"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bangalore, Remote"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="mt-8 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="mt-4 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg text-sm">{error}</p>
      )}

      {!loading && !error && jobs.length === 0 && (
        <div className="mt-12 text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-600">No jobs match your search.</p>
          <p className="text-slate-500 text-sm mt-1">
            Try adjusting your keywords or location, or sign in as an employer to post jobs.
          </p>
          {isEmployee && (
            <Link
              to="/employee/dashboard"
              className="inline-block mt-4 text-primary-600 font-medium hover:underline"
            >
              Go to Dashboard
            </Link>
          )}
        </div>
      )}

      {!loading && !error && jobs.length > 0 && (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} showApply={isEmployee} />
          ))}
        </div>
      )}
    </div>
  );
}
