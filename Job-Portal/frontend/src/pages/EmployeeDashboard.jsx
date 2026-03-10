import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApplications, uploadResume } from '../api/employee';
import { getPublicJobs } from '../api/jobs';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);

  const [appsLoading, setAppsLoading] = useState(true);
  const [appsError, setAppsError] = useState('');
  const [applications, setApplications] = useState([]);
  const [jobIndex, setJobIndex] = useState({});

  const handleResumeSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setUploadError('Please select a PDF or DOC file.');
      return;
    }
    setUploadError('');
    setUploadStatus('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      await uploadResume(formData);
      setUploadStatus('Resume uploaded successfully.');
      setResumeFile(null);
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setAppsLoading(true);
      setAppsError('');
      try {
        const [{ data: appsData }, { data: jobsData }] = await Promise.all([
          getMyApplications(),
          getPublicJobs(),
        ]);

        const myJobs = appsData?.myJobs ?? [];
        const jobs = jobsData?.jobs ?? jobsData?.allJobs ?? [];

        const idx = {};
        if (Array.isArray(jobs)) {
          for (const j of jobs) {
            const key = j?.jobId || j?._id;
            if (key) idx[String(key)] = j;
          }
        }

        if (!cancelled) {
          setApplications(Array.isArray(myJobs) ? myJobs : []);
          setJobIndex(idx);
        }
      } catch (err) {
        if (!cancelled) {
          setApplications([]);
          setJobIndex({});
          setAppsError(err.response?.data?.message || err.message || 'Failed to load your applications.');
        }
      } finally {
        if (!cancelled) setAppsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const appliedRows = useMemo(() => {
    return (applications || []).map((a) => {
      const jobKey = String(a.job_id);
      const job = jobIndex[jobKey];
      return {
        _id: a._id,
        jobId: job?.jobId || a.job_id,
        title: job?.title || 'Job',
        company: job?.company || '-',
        location: job?.location || '-',
        email: a.email,
        resumeUrl: a.resume?.url,
        status: a.status || 'Pending',
      };
    });
  }, [applications, jobIndex]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-slate-800">Dashboard</h1>
      <p className="text-slate-600 mt-1">Welcome back, {user?.userName}.</p>

      <div className="mt-8 grid gap-8">
        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold text-slate-800">Applied jobs</h2>
              <p className="text-slate-600 text-sm mt-1">Jobs you have applied for.</p>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 transition"
            >
              Browse jobs
            </Link>
          </div>

          {appsLoading ? (
            <div className="mt-4 animate-pulse space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded-lg" />
              ))}
            </div>
          ) : appsError ? (
            <p className="mt-4 text-sm text-red-600 bg-red-50 px-4 py-2 rounded-lg">{appsError}</p>
          ) : appliedRows.length === 0 ? (
            <div className="mt-4 bg-slate-50 rounded-xl border border-slate-200 p-6 text-center">
              <p className="text-slate-600">You haven’t applied to any jobs yet.</p>
              <Link to="/jobs" className="inline-block mt-3 text-primary-600 font-medium hover:underline">
                Browse jobs
              </Link>
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500">
                    <th className="py-2 pr-4 font-medium">Job</th>
                    <th className="py-2 pr-4 font-medium">Company</th>
                    <th className="py-2 pr-4 font-medium">Location</th>
                    <th className="py-2 pr-4 font-medium">Job ID</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 font-medium">Resume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appliedRows.map((r) => (
                    <tr key={r._id}>
                      <td className="py-2 pr-4 text-slate-800">{r.title}</td>
                      <td className="py-2 pr-4 text-slate-700">{r.company}</td>
                      <td className="py-2 pr-4 text-slate-700">{r.location}</td>
                      <td className="py-2 pr-4 text-slate-500">{r.jobId}</td>
                      <td className="py-2 pr-4">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            r.status === 'Short-listed'
                              ? 'bg-green-100 text-green-700'
                              : r.status === 'Rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2 pr-4">
                        {r.resumeUrl ? (
                          <a
                            href={r.resumeUrl}
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
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-display text-lg font-semibold text-slate-800">Your profile</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div><dt className="text-slate-500">Name</dt><dd className="text-slate-800">{user?.userName}</dd></div>
            <div><dt className="text-slate-500">Email</dt><dd className="text-slate-800">{user?.email}</dd></div>
            {user?.designation && <div><dt className="text-slate-500">Designation</dt><dd className="text-slate-800">{user.designation}</dd></div>}
            {user?.experience && <div><dt className="text-slate-500">Experience</dt><dd className="text-slate-800">{user.experience}</dd></div>}
            {user?.address && <div><dt className="text-slate-500">Address</dt><dd className="text-slate-800">{user.address}</dd></div>}
          </dl>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-display text-lg font-semibold text-slate-800">Resume</h2>
          <p className="text-slate-600 text-sm mt-1">Upload a PDF or DOC file. You'll use this when applying to jobs.</p>
          <form onSubmit={handleResumeSubmit} className="mt-4">
            <input
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary-50 file:text-primary-700"
            />
            {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
            {uploadStatus && <p className="mt-2 text-sm text-green-600">{uploadStatus}</p>}
            <button
              type="submit"
              disabled={loading || !resumeFile}
              className="mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {loading ? 'Uploading...' : 'Upload resume'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-display text-lg font-semibold text-slate-800">Find jobs</h2>
          <p className="text-slate-600 text-sm mt-1">Browse open positions and apply with your resume.</p>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-700 transition"
          >
            Browse Jobs
          </Link>
        </section>
      </div>
    </div>
  );
}
