import { Link } from 'react-router-dom';

export default function JobCard({ job, showApply = false, employerView = false }) {
  const id = job._id || job.id;
  const jobId = job.jobId || id;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-slate-800 text-lg truncate">{job.title}</h3>
          <p className="text-slate-600 font-medium mt-0.5">{job.company}</p>
          {job.location && (
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </p>
          )}
          {job.salary > 0 && (
            <p className="text-slate-600 text-sm mt-1">
              ₹{Number(job.salary).toLocaleString()}
            </p>
          )}
          <p className="text-slate-500 text-sm mt-2 line-clamp-2">{job.description}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className={`text-xs px-2 py-1 rounded-full ${job.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
              {job.status || 'Open'}
            </span>
            <span className="text-xs text-slate-400">ID: {jobId}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:flex-col sm:flex-nowrap">
          {showApply && job.status === 'Open' && (
            <Link
              to={`/employee/apply/${jobId}`}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
            >
              Apply
            </Link>
          )}
          {employerView && (
            <>
              <Link
                to={`/employer/dashboard?edit=${id}`}
                className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
              >
                Update
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
