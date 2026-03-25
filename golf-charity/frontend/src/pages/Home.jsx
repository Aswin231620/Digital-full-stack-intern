import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, Trophy, HeartHandshake, CalendarCheck } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 lg:py-32 flex flex-col items-center text-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-dark-900 -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px] -z-10"></div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200">
          Play Golf. Win Big. <br /> Change Lives.
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mb-10 leading-relaxed">
          The premium subscription platform that turns your Stableford scores into lottery tickets while supporting your favorite charities.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {!user ? (
            <Link to="/register" className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Your Journey <ArrowRight size={20} />
            </Link>
          ) : (
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="bg-emerald-500 hover:bg-emerald-400 text-dark-900 font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
              Go to Dashboard <ArrowRight size={20} />
            </Link>
          )}
          <Link to="/charities" className="bg-dark-800 hover:bg-dark-700 text-white font-semibold text-lg px-8 py-4 rounded-xl border border-dark-600 transition-all flex items-center justify-center gap-2">
            View Charities
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <CalendarCheck size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Weekly Input</h3>
            <p className="text-gray-400">Log your latest 5 Stableford scores. New scores automatically replace your oldest ones.</p>
          </div>

          <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all relative">
            <div className="absolute -top-4 -right-4 bg-emerald-500 text-dark-900 text-xs font-bold px-3 py-1 rounded-full shadow-lg">Jackpot</div>
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Trophy size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Monthly Draw</h3>
            <p className="text-gray-400">Match 3, 4, or 5 numbers in our monthly draw to win huge cash prizes from the jackpot pool.</p>
          </div>

          <div className="bg-dark-800 p-8 rounded-2xl border border-dark-700 flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <HeartHandshake size={32} />
            </div>
            <h3 className="text-2xl font-bold mb-3">Give Back</h3>
            <p className="text-gray-400">At least 10% of revenue goes directly to your chosen charity. Play with purpose.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
