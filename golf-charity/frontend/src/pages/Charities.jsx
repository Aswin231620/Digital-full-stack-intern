import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Loader, Search } from 'lucide-react';

export default function Charities() {
  const [charities, setCharities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await api.get('/charities');
        setCharities(res.data.charities);
      } catch (error) {
        console.error('Failed to fetch charities', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const handleSelectCharity = async (charityId) => {
    if (!user) return setMessage('Please log in to select a charity.');
    try {
      await api.post('/charities/select', { charityId });
      setMessage('Charity selected successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to select charity');
    }
  };

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.description && c.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-emerald-500" size={40} /></div>;

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-emerald-500">Supported Charities</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Choose a charity to support with your subscription. A minimum of 10% goes directly to them.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-10 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search charities by name or cause..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-dark-800 border border-dark-700 rounded-full pl-12 pr-6 py-4 text-white focus:outline-none focus:border-emerald-500 shadow-lg transition-all"
        />
      </div>

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500 text-emerald-400 px-4 py-3 rounded-lg mb-8 text-center font-medium">
          {message}
        </div>
      )}

      {filteredCharities.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-dark-800 rounded-xl border border-dark-700">
          No charities match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCharities.map((charity) => (
            <div key={charity.id} className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700 hover:border-emerald-500/50 transition-all flex flex-col group">
              <div className="h-48 bg-dark-900 border-b border-dark-700 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {charity.logo_url ? (
                  <img src={charity.logo_url} alt={charity.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <Heart size={48} className="text-dark-600" />
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors">{charity.name}</h3>
                <p className="text-gray-400 text-sm flex-grow mb-6 line-clamp-3">
                  {charity.description || 'No description provided.'}
                </p>
                <button
                  onClick={() => handleSelectCharity(charity.id)}
                  className="w-full bg-dark-700 hover:bg-emerald-600 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Heart size={16} /> Choose to Support
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
