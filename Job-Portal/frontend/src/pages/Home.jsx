import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-primary-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
        <div className="relative max-w-6xl mx-auto px-4 py-20 sm:py-28 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Find your next <span className="text-primary-300">opportunity</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-slate-300">
              Connect with employers or discover talented candidates. One platform for jobs and hiring.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/jobs"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition shadow-lg"
              >
                Browse Jobs
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl font-semibold text-center text-slate-800 mb-12">
            I am a...
          </h2>
          <div className="grid sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Link
              to="/register?role=employee"
              className="group block p-8 rounded-2xl border-2 border-slate-200 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 group-hover:text-white transition">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800">Job Seeker</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Create a profile, upload your resume, and apply to jobs that match your skills.
              </p>
              <span className="mt-4 inline-block text-primary-600 font-medium text-sm group-hover:underline">
                Sign up as Employee →
              </span>
            </Link>
            <Link
              to="/register?role=employer"
              className="group block p-8 rounded-2xl border-2 border-slate-200 hover:border-primary-500 hover:shadow-lg transition text-center"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-500 group-hover:text-white transition">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-800">Employer</h3>
              <p className="mt-2 text-slate-600 text-sm">
                Post jobs, manage applications, and find the right candidates for your team.
              </p>
              <span className="mt-4 inline-block text-primary-600 font-medium text-sm group-hover:underline">
                Sign up as Employer →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
