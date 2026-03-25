import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle, Heart } from 'lucide-react';
import api from '../services/api';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [charityId, setCharityId] = useState('');
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data.charities);
        if (res.data.charities.length > 0) setCharityId(res.data.charities[0].id);
      } catch (err) {
        console.error('Failed to load charities');
      }
    };
    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await register(email, password, charityId);
      setTimeout(() => navigate('/dashboard'), 100);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-dark-800 p-8 rounded-xl shadow-2xl border border-dark-700">
      <h2 className="text-3xl font-bold mb-6 text-center text-emerald-500">Create Account</h2>
      <p className="text-gray-400 text-center mb-8">Join the Golf Charity Platform today!</p>
      
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="email"
              required
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="password"
              required
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="•••••••• (min 6 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Support a Charity (10% of sub)</label>
          <div className="relative">
            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
            <select
              required
              value={charityId}
              onChange={(e) => setCharityId(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
            >
              <option value="" disabled>Select a charity...</option>
              {charities.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-6 text-center text-gray-400">
        Already have an account? <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-semibold">Sign in</Link>
      </p>
    </div>
  );
}
