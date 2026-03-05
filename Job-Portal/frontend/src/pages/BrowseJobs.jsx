import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPublicJobs } from '../api/jobs';
import JobCard from '../components/JobCard';

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isEmployee } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getPublicJobs();
        const list = res.data?.jobs ?? res.data?.allJobs ?? [];
        if (!cancelled) setJobs(Array.isArray(list) ? list : []);
      } catch (e) {
        if (!cancelled) {
          setJobs([]);
          setError(e.message || 'Could not load jobs.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-slate-200 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <h1 className="font-display text-2xl sm:text-3xl font-semibold text-slate-800">Browse Jobs</h1>
      <p className="text-slate-600 mt-1">Open positions you can apply to.</p>

      {error && (
        <p className="mt-4 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg text-sm">{error}</p>
      )}

      {jobs.length === 0 ? (
        <div className="mt-12 text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
          <p className="text-slate-600">No jobs listed at the moment.</p>
          <p className="text-slate-500 text-sm mt-1">Check back later or sign in as an employer to post jobs.</p>
          {isEmployee && (
            <Link to="/employee/dashboard" className="inline-block mt-4 text-primary-600 font-medium hover:underline">
              Go to Dashboard
            </Link>
          )}
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {jobs.map((job) => (
            <JobCard key={job._id || job.id} job={job} showApply={isEmployee} />
          ))}
        </div>
      )}
    </div>
  );
}
