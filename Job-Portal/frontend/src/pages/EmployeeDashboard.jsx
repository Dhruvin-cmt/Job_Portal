import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadResume } from '../api/employee';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-semibold text-slate-800">Dashboard</h1>
      <p className="text-slate-600 mt-1">Welcome back, {user?.userName}.</p>

      <div className="mt-8 grid gap-8">
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
