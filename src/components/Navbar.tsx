import { Link } from 'react-router-dom';
import AuthButton from './AuthButton';
import { Rocket } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-indigo-600 rounded-xl group-hover:rotate-12 transition-transform">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              Vibe Store
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link to="/explore" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Explore
            </Link>
            <Link to="/submit" className="hidden sm:block text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">
              Submit App
            </Link>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
