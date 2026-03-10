import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Footer() {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-slate-900 text-slate-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <Link to="/" className="font-display font-semibold text-white text-lg">
            JobPortal
          </Link>
          <div className="flex gap-6">
            <Link to="/jobs" className="text-sm hover:text-white transition">
              Browse Jobs
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="text-sm hover:text-white transition">
                  Log in
                </Link>
                <Link to="/register" className="text-sm hover:text-white transition">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
        <p className="mt-6 text-center sm:text-left text-sm text-slate-500">
          © {new Date().getFullYear()} JobPortal. Find your next opportunity.
        </p>
      </div>
    </footer>
  );
}
