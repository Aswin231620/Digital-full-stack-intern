import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Loader, CheckCircle2, Sliders, Save } from 'lucide-react';
import { toast } from '../components/Toast';

export default function CharitySelect() {
  const { user } = useAuth();
  const [charities, setCharities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  
  const [selectedId, setSelectedId] = useState('');
  const [percentage, setPercentage] = useState(10);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cRes, pRes] = await Promise.all([
        api.get('/charities'),
        api.get('/users/profile')
      ]);
      setCharities(cRes.data.charities);
      setProfile(pRes.data);
      setSelectedId(pRes.data.charity_id || '');
      setPercentage(pRes.data.charity_percentage || 10);
    } catch (err) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setProcessing(true);
    try {
      await api.put('/users/profile/charity', { 
        charity_id: selectedId, 
        charity_percentage: percentage 
      });
      toast.success('Donation settings updated!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Update failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Gifts of <span className="text-pink-500">Gratitude</span></h1>
        <p className="text-gray-400 max-w-xl mx-auto">Decide where your legacy goes. Change your charity or donation percentage at any time.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 shadow-xl">
            <label className="block text-gray-500 font-black uppercase text-xs tracking-wider mb-6">Choose Your Cause</label>
            <div className="grid grid-cols-1 gap-4">
              {charities.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className={`flex items-center gap-6 p-6 rounded-2xl border transition-all text-left group ${selectedId === c.id ? 'bg-emerald-600 border-emerald-500' : 'bg-dark-900 border-dark-700 hover:border-emerald-500/50'}`}
                >
                  <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center p-2 bg-dark-800 border border-dark-700 group-hover:bg-dark-700 transition-colors`}>
                    {c.logo_url ? <img src={c.logo_url} className="max-h-full object-contain" /> : <Heart size={20} className="text-pink-500" />}
                  </div>
                  <div className="flex-grow">
                    <p className={`font-bold text-lg ${selectedId === c.id ? 'text-white' : 'text-gray-200'}`}>{c.name}</p>
                    <p className={`text-sm line-clamp-1 ${selectedId === c.id ? 'text-emerald-100' : 'text-gray-500'}`}>{c.description}</p>
                  </div>
                  {selectedId === c.id && <CheckCircle2 className="text-white" size={24} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 sticky top-8">
            <h4 className="font-bold text-white text-xl mb-6 flex items-center gap-2">
              <Sliders size={20} className="text-emerald-500" /> Contribution
            </h4>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-4">
                <span className="text-gray-400 font-medium">Donation Percentage</span>
                <span className="text-emerald-500 font-black">{percentage}%</span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="100" 
                step="5"
                value={percentage}
                onChange={(e) => setPercentage(Number(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-dark-900 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-500 mt-2 font-black tracking-widest uppercase">
                <span>10% (Min)</span>
                <span>100% (Hero)</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic leading-relaxed mb-8">
              By setting this to <span className="text-emerald-400 font-bold">{percentage}%</span>, a total of <span className="text-emerald-400 font-bold">${((user?.subscription_type === 'yearly' ? 100 : 10) * (percentage / 100)).toFixed(2)}</span> will be donated to your cause per billing cycle.
            </p>

            <button
              onClick={handleUpdate}
              disabled={processing || (!selectedId)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Save size={18} /> Update Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
