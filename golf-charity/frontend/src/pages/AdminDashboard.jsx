import { useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from '../components/Toast';
import { Target, CheckCircle2, XCircle, Gift, Users, Loader, BarChart3, Heart, Play, Edit2, Trash2, Shield, UserX, UserCheck } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [charityData, setCharityData] = useState({ id: null, name: '', description: '', logo_url: '' });
  const [draws, setDraws] = useState([]);
  const [winners, setWinners] = useState([]);
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawConfig, setDrawConfig] = useState({ type: 'random', simulate: true });
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab]);

  const fetchTabData = async (tab) => {
    setLoading(true);
    try {
      if (tab === 'analytics') {
        const res = await api.get('/admin/analytics');
        setAnalytics(res.data);
      } else if (tab === 'draw') {
        const res = await api.get('/draws');
        setDraws(res.data.draws);
      } else if (tab === 'winners') {
        const res = await api.get('/admin/winners');
        setWinners(res.data.winners);
      } else if (tab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data.users);
      } else if (tab === 'charities') {
        const res = await api.get('/charities');
        setCharities(res.data.charities);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleRunDraw = async () => {
    const action = drawConfig.simulate ? 'Simulate' : 'Execute REAL';
    if (!window.confirm(`${action} the monthly lottery draw now using ${drawConfig.type} algorithm?`)) return;
    
    setLoading(true);
    try {
      const res = await api.post('/admin/run-draw', drawConfig);
      if (drawConfig.simulate) {
        setSimResults(res.data);
        toast.info('Simulation complete. Review results below.');
      } else {
        toast.success(`Draw executed! Pool: $${res.data.draw.prize_pool}`);
        fetchTabData('draw');
        setSimResults(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Draw failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCharity = async (e) => {
    e.preventDefault();
    try {
      if (charityData.id) {
        await api.put(`/charities/${charityData.id}`, charityData);
        toast.success('Charity updated!');
      } else {
        await api.post('/charities', charityData);
        toast.success('Charity added!');
      }
      setCharityData({ id: null, name: '', description: '', logo_url: '' });
      fetchTabData('charities');
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm('Delete this charity? This may affect users who have it selected.')) return;
    try {
      await api.delete(`/charities/${id}`);
      toast.success('Charity deleted');
      fetchTabData('charities');
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      await api.put(`/admin/users/${userId}`, updates);
      toast.success('User updated');
      fetchTabData('users');
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleVerifyWinner = async (winnerId, status) => {
    try {
      await api.put('/admin/verify-winner', { winnerId, status });
      toast.success(`Winner marked as ${status}`);
      fetchTabData('winners');
    } catch (err) {
      toast.error('Verification failed');
    }
  };

  const tabs = [
    { id: 'analytics', label: 'Reports', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'draw', label: 'Draw Engine', icon: Target },
    { id: 'winners', label: 'Verify Winners', icon: CheckCircle2 },
    { id: 'charities', label: 'Charity Management', icon: Gift },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-dark-700">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Shield className="text-emerald-500" /> Admin Console
        </h1>
      </div>

      <div className="flex gap-2 border-b border-dark-700 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-xl transition-all font-bold whitespace-nowrap ${
              activeTab === tab.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-dark-800'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 min-h-[500px] shadow-2xl">
        {loading ? (
          <div className="flex justify-center items-center h-64"><Loader className="animate-spin text-emerald-500" size={40} /></div>
        ) : (
          <>
            {activeTab === 'analytics' && analytics && (
               <div className="space-y-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   <div className="bg-dark-900 p-6 rounded-2xl border border-dark-700">
                     <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Total Users</p>
                     <p className="text-4xl font-black text-white">{analytics.totalUsers}</p>
                   </div>
                   <div className="bg-dark-900 p-6 rounded-2xl border border-emerald-500/20">
                     <p className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-2">Active Subs</p>
                     <p className="text-4xl font-black text-emerald-400">{analytics.activeSubscribers}</p>
                   </div>
                   <div className="bg-dark-900 p-6 rounded-2xl border border-yellow-500/20">
                     <p className="text-xs font-black text-yellow-500 uppercase tracking-widest mb-2">Total Pool</p>
                     <p className="text-4xl font-black text-yellow-400">${analytics.totalPrizePool}</p>
                   </div>
                   <div className="bg-dark-900 p-6 rounded-2xl border border-pink-500/20">
                     <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">Charity Impact</p>
                     <p className="text-4xl font-black text-pink-400">${analytics.totalCharityRaised}</p>
                   </div>
                 </div>
               </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="overflow-x-auto rounded-2xl border border-dark-700 bg-dark-900">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-dark-800 text-gray-500 font-black uppercase tracking-widest text-[10px]">
                      <tr>
                        <th className="p-5">User</th>
                        <th className="p-5">Role</th>
                        <th className="p-5">Subscription</th>
                        <th className="p-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-dark-700">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-dark-800/40 transition-colors">
                          <td className="p-5">
                            <p className="font-bold text-white mb-1">{u.email}</p>
                            <p className="text-[10px] text-gray-500">Member since {new Date(u.created_at).toLocaleDateString()}</p>
                          </td>
                          <td className="p-5">
                            <select 
                              value={u.role} 
                              onChange={(e) => handleUpdateUser(u.id, { role: e.target.value })}
                              className="bg-dark-800 border border-dark-700 text-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold focus:border-purple-500 outline-none"
                            >
                              <option value="subscriber">Subscriber</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="p-5">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.subscription_status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                              {u.subscription_status}
                            </span>
                          </td>
                          <td className="p-5 text-right">
                             <button 
                              onClick={() => handleUpdateUser(u.id, { subscription_status: u.subscription_status === 'active' ? 'inactive' : 'active' })}
                              className={`p-2 rounded-lg transition-all ${u.subscription_status === 'active' ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                             >
                               {u.subscription_status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'draw' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="bg-dark-900/50 p-8 rounded-3xl border border-dark-700 space-y-8">
                     <h3 className="text-xl font-bold flex items-center gap-2">
                       <Target className="text-emerald-500" /> Draw Configuration
                     </h3>
                     <div className="space-y-4">
                       <label className="block">
                         <span className="text-xs font-black text-gray-500 uppercase tracking-widest block mb-3 ml-1">Algorithm Selection</span>
                         <div className="grid grid-cols-2 gap-3">
                           <button 
                            onClick={() => setDrawConfig({...drawConfig, type: 'random'})}
                            className={`p-4 rounded-2xl border font-bold transition-all ${drawConfig.type === 'random' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-dark-800 border-dark-700 text-gray-400'}`}
                           >
                              Pure Random
                           </button>
                           <button 
                            onClick={() => setDrawConfig({...drawConfig, type: 'algorithm'})}
                            className={`p-4 rounded-2xl border font-bold transition-all ${drawConfig.type === 'algorithm' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-dark-800 border-dark-700 text-gray-400'}`}
                           >
                              Lucky Weighted
                           </button>
                         </div>
                       </label>

                       <label className="flex items-center gap-4 p-4 bg-dark-800 rounded-2xl cursor-pointer hover:bg-dark-700 transition-colors border border-dark-700">
                         <input 
                          type="checkbox" 
                          checked={drawConfig.simulate} 
                          onChange={(e) => setDrawConfig({...drawConfig, simulate: e.target.checked})}
                          className="w-5 h-5 accent-emerald-500"
                         />
                         <div>
                          <p className="font-bold text-sm">Simulation Mode</p>
                          <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Don't persist winners</p>
                         </div>
                       </label>
                     </div>

                     <button 
                      onClick={handleRunDraw}
                      className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${drawConfig.simulate ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'}`}
                     >
                        {drawConfig.simulate ? <Play size={24} /> : <Target size={24} />}
                        {drawConfig.simulate ? 'Start Simulation' : 'Execute REAL Draw'}
                     </button>
                  </div>

                  {simResults && (
                    <div className="bg-emerald-600/5 border border-emerald-500/20 p-8 rounded-3xl animate-in fade-in slide-in-from-bottom-4">
                      <h4 className="text-lg font-bold mb-6 text-emerald-500">Simulation Statistics</h4>
                      <div className="grid grid-cols-3 gap-6 mb-8">
                         <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-1">5 Match</p>
                            <p className="text-2xl font-black text-white">{simResults.breakdown.matches5.count}</p>
                         </div>
                         <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-1">4 Match</p>
                            <p className="text-2xl font-black text-white">{simResults.breakdown.matches4.count}</p>
                         </div>
                         <div className="bg-dark-900 border border-dark-700 p-4 rounded-xl">
                            <p className="text-[10px] font-black text-gray-500 uppercase mb-1">3 Match</p>
                            <p className="text-2xl font-black text-white">{simResults.breakdown.matches3.count}</p>
                         </div>
                      </div>
                      <div className="bg-dark-900 border border-dark-700 p-6 rounded-2xl">
                        <p className="text-xs font-black text-gray-500 uppercase mb-4 tracking-widest">Winning Sequence</p>
                        <div className="flex gap-4">
                           {simResults.draw.winning_numbers.map((n, i) => (
                             <div key={i} className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-black text-white shadow-lg shadow-emerald-600/40">{n}</div>
                           ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'winners' && (
              <div className="space-y-6">
                 {winners.length === 0 ? (
                   <div className="text-center py-20 text-gray-500 font-bold italic">No winners awaiting verification</div>
                 ) : (
                   <div className="grid grid-cols-1 gap-4">
                     {winners.map(win => (
                       <div key={win.id} className="bg-dark-900 border border-dark-700 p-6 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                         <div className="flex items-center gap-6">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black ${win.match_count === 5 ? 'bg-yellow-500 text-dark-900' : 'bg-dark-800 text-gray-300 border border-dark-700'}`}>
                               {win.match_count}
                            </div>
                            <div>
                               <p className="font-bold text-white text-lg">{win.users.email}</p>
                               <p className="text-emerald-500 font-black text-sm uppercase tracking-widest">${win.prize_amount} Payout</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-4">
                            {win.proof_image_url ? (
                              <button 
                                onClick={() => window.open(win.proof_image_url)}
                                className="bg-dark-800 hover:bg-dark-700 text-white font-bold px-4 py-2 rounded-lg border border-dark-700 transition-colors flex items-center gap-2"
                              >
                                 <FileImage size={16} /> View Proof
                              </button>
                            ) : <span className="text-xs text-gray-600 font-bold uppercase tracking-widest">Awaiting Proof</span>}
                            
                            {win.status === 'pending' && win.proof_image_url && (
                              <div className="flex gap-2">
                                <button onClick={() => handleVerifyWinner(win.id, 'paid')} className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all"><CheckCircle2 size={20} /></button>
                                <button onClick={() => handleVerifyWinner(win.id, 'rejected')} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all"><XCircle size={20} /></button>
                              </div>
                            )}
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}

            {activeTab === 'charities' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-8">
                    <h3 className="text-xl font-bold">{charityData.id ? 'Edit Charity' : 'Register Charity'}</h3>
                    <form onSubmit={handleSaveCharity} className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Charity Name</label>
                         <input 
                          type="text" required
                          value={charityData.name} 
                          onChange={(e) => setCharityData({...charityData, name: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Legacy Mission</label>
                         <textarea 
                          rows="4" required
                          value={charityData.description} 
                          onChange={(e) => setCharityData({...charityData, description: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none resize-none transition-all"
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brand Logo URL</label>
                         <input 
                          type="url"
                          value={charityData.logo_url} 
                          onChange={(e) => setCharityData({...charityData, logo_url: e.target.value})}
                          className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                         />
                       </div>
                       <div className="flex gap-4">
                        <button type="submit" className="flex-grow bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all">
                          {charityData.id ? 'Save Changes' : 'Launch Charity'}
                        </button>
                        {charityData.id && (
                          <button 
                            type="button" 
                            onClick={() => setCharityData({ id: null, name: '', description: '', logo_url: '' })}
                            className="px-6 border border-dark-700 text-gray-500 hover:text-white rounded-2xl font-bold transition-colors"
                          >
                            Reset
                          </button>
                        )}
                       </div>
                    </form>
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-xl font-bold flex justify-between items-center">
                      Live Charities <span className="text-xs text-gray-500 uppercase tracking-widest">{charities.length} Total</span>
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                       {charities.map(c => (
                         <div key={c.id} className="bg-dark-900 border border-dark-700 p-5 rounded-2xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-dark-800 rounded-xl flex items-center justify-center p-2 border border-dark-700 group-hover:bg-dark-700 transition-colors">
                                 {c.logo_url ? <img src={c.logo_url} className="max-h-full object-contain" /> : <Heart size={20} className="text-pink-500" />}
                               </div>
                               <div>
                                 <p className="font-bold text-white transition-colors group-hover:text-emerald-400">{c.name}</p>
                                 <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Active Partner</p>
                               </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                               <button onClick={() => setCharityData(c)} className="p-2 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg"><Edit2 size={16} /></button>
                               <button onClick={() => handleDeleteCharity(c.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={16} /></button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
