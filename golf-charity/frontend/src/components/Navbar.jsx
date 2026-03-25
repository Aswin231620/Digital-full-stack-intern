import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, LayoutDashboard, Heart } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-800 border-b border-dark-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold font-sans text-emerald-500 flex items-center gap-2">
              <span className="text-2xl">🏌️</span>
              FairwayFund
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link to="/how-it-works" className="text-gray-300 hover:text-emerald-400 font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/charities" className="text-gray-300 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors">
              <Heart size={18} /> Charities
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                  className="text-gray-300 hover:text-emerald-400 font-medium flex items-center gap-1 transition-colors"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </Link>
                <div className="h-6 w-px bg-dark-700"></div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors bg-dark-900 px-3 py-1.5 rounded-lg border border-dark-700 hover:border-red-900/50"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-gray-300 hover:text-white font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-emerald-500/20">
                  Join Now
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
