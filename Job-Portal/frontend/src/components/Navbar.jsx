import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="font-display font-semibold text-xl text-primary-600">
              JobPortal
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:gap-6">
              <Link
                to="/jobs"
                className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-md transition"
              >
                Browse Jobs
              </Link>
              {isAuthenticated && role === 'Employer' && (
                <>
                  <Link
                    to="/employer/dashboard"
                    className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-md transition"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/employer/publish"
                    className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-md transition"
                  >
                    Publish Job
                  </Link>
                </>
              )}
              {isAuthenticated && role === 'Employee' && (
                <Link
                  to="/employee/dashboard"
                  className="text-slate-600 hover:text-primary-600 px-3 py-2 text-sm font-medium rounded-md transition"
                >
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  state={{ from: location.pathname }}
                  className="text-slate-600 hover:text-primary-600 px-4 py-2 text-sm font-medium rounded-md transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-primary-700 transition shadow-sm"
                >
                  Sign up
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium text-sm">
                    {user?.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{user?.userName}</span>
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-1 w-48 py-1 bg-white rounded-lg shadow-lg border border-slate-200 z-20">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-800">{user?.userName}</p>
                        <p className="text-xs text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {role}
                        </span>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 rounded-b-lg"
                      >
                        Log out
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="sm:hidden py-3 border-t border-slate-200">
            <Link to="/jobs" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Browse Jobs</Link>
            {isAuthenticated && role === 'Employer' && (
              <>
                <Link to="/employer/dashboard" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <Link to="/employer/publish" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Publish Job</Link>
              </>
            )}
            {isAuthenticated && role === 'Employee' && (
              <Link to="/employee/dashboard" className="block px-4 py-2 text-slate-600 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
