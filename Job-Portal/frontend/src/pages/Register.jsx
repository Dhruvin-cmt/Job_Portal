import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { empRegister, employerRegister } from '../api/auth';

export default function Register() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role') || 'employee';
  const [role, setRole] = useState(roleParam === 'employer' ? 'employer' : 'employee');
  const [form, setForm] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    currentWorkSpace: '',
    address: '',
    experience: '',
    designation: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, isAuthenticated, role: currentRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(currentRole === 'Employer' ? '/employer/dashboard' : '/employee/dashboard', { replace: true });
    }
  }, [isAuthenticated, currentRole, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        userName: form.userName,
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      if (role === 'employer') {
        payload.currentWorkSpace = form.currentWorkSpace;
      } else {
        payload.address = form.address;
        payload.experience = form.experience;
        payload.designation = form.designation;
      }
      const api = role === 'employer' ? employerRegister : empRegister;
      const { data } = await api(payload);
      setUser(data.user);
      navigate(role === 'employer' ? '/employer/dashboard' : '/employee/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
          <h1 className="font-display text-2xl font-semibold text-slate-800 text-center">Create account</h1>
          <p className="text-slate-500 text-sm text-center mt-1">Choose your role and sign up</p>

          <div className="flex rounded-lg bg-slate-100 p-1 mt-6">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'employee' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole('employer')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition ${role === 'employer' ? 'bg-white text-slate-800 shadow' : 'text-slate-600'}`}
            >
              Employer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
              <input
                type="text"
                required
                minLength={3}
                value={form.userName}
                onChange={(e) => setForm((f) => ({ ...f, userName: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="John Doe"
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <input
                type="password"
                required
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            {role === 'employer' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company / Workspace</label>
                <input
                  type="text"
                  value={form.currentWorkSpace}
                  onChange={(e) => setForm((f) => ({ ...f, currentWorkSpace: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Acme Inc."
                />
              </div>
            )}
            {role === 'employee' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="City, Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Experience</label>
                  <input
                    type="text"
                    value={form.experience}
                    onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="e.g. 2 years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
              </>
            )}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary-600 text-white font-medium hover:bg-primary-700 disabled:opacity-50 transition"
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to={`/login?role=${role}`} className="text-primary-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
