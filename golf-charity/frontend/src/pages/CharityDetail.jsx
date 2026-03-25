import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Heart, Loader, ArrowLeft, ExternalLink, Globe, Calendar } from 'lucide-react';

export default function CharityDetail() {
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharity = async () => {
      try {
        const res = await api.get('/charities');
        const found = res.data.charities.find(c => c.id === id);
        setCharity(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharity();
  }, [id]);

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-emerald-500" size={40} /></div>;
  if (!charity) return <div className="text-center mt-20 text-white">Charity not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Link to="/charities" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
        <ArrowLeft size={18} /> Back to Charities
      </Link>

      <div className="bg-dark-800 rounded-3xl border border-dark-700 overflow-hidden shadow-2xl">
        <div className="h-64 bg-dark-900 flex items-center justify-center p-12 border-b border-dark-700 relative">
          <div className="absolute inset-0 bg-emerald-500/5"></div>
          {charity.logo_url ? (
            <img src={charity.logo_url} alt={charity.name} className="max-h-full max-w-full object-contain relative transition-transform hover:scale-105 duration-500" />
          ) : (
            <Heart size={80} className="text-dark-600" />
          )}
        </div>

        <div className="p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{charity.name}</h1>
              <p className="text-emerald-500 font-medium flex items-center gap-2">
                <Heart size={16} /> Verified Partner
              </p>
            </div>
            <Link to="/register" className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 text-center">
              Support this Charity
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            <div className="bg-dark-900/50 p-6 rounded-2xl border border-dark-700">
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Impact</p>
              <p className="text-white font-semibold">10% - 100% per sub</p>
            </div>
            <div className="bg-dark-900/50 p-6 rounded-2xl border border-dark-700">
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Status</p>
              <p className="text-white font-semibold flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div> Active
              </p>
            </div>
            <div className="bg-dark-900/50 p-6 rounded-2xl border border-dark-700">
              <p className="text-xs text-gray-500 uppercase font-black tracking-widest mb-1">Joined</p>
              <p className="text-white font-semibold flex items-center gap-2">
                 <Calendar size={14} /> {new Date(charity.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h3 className="text-xl font-bold text-white mb-4">About the Mission</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {charity.description || 'This charity is dedicated to making a positive difference in the world. By choosing to support them, you are helping fund critical projects and initiatives that change lives for the better.'}
            </p>
          </div>

          <div className="mt-12 pt-8 border-t border-dark-700 flex justify-center">
             <button className="text-gray-500 hover:text-white flex items-center gap-2 text-sm transition-colors">
               <Globe size={16} /> Official Website <ExternalLink size={14} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
