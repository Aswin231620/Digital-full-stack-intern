import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/Toast';
import { Send, CheckCircle2, AlertCircle, Trophy, FileImage, Loader, Calendar, Target, Edit2, Trash2, Heart, CreditCard, ChevronRight, Settings } from 'lucide-react';

// Helper: get next draw date (last day of next month)
const getNextDrawDisplay = () => {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 2, 0);
  return next.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

export default function UserDashboard() {
  const { user } = useAuth();
  const [scores, setScores] = useState([]);
  const [winnings, setWinnings] = useState([]);
  const [newScore, setNewScore] = useState('');
  const [scoreDate, setScoreDate] = useState(new Date().toISOString().split('T')[0]);
  const [scoreError, setScoreError] = useState('');
  const [editingScore, setEditingScore] = useState(null);
  const [sub, setSub] = useState({ status: user.subscription_status, type: null, end: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const subRes = await api.get('/subscriptions/status');
      setSub({
        status: subRes.data.subscription_status,
        type: subRes.data.subscription_type,
        end: subRes.data.subscription_end,
      });

      if (subRes.data.subscription_status === 'active' || user.role === 'admin') {
        const [scoresRes, winningsRes] = await Promise.all([
          api.get('/scores'),
          api.get('/winners/me')
        ]);
        setScores(scoresRes.data.scores);
        setWinnings(winningsRes.data.winners);
      }
    } catch (err) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const validateScore = (val) => {
    const num = parseInt(val);
    if (!val) return 'Score is required';
    if (isNaN(num)) return 'Must be a number';
    if (num < 1) return 'Minimum score is 1';
    if (num > 45) return 'Maximum score is 45';
    return '';
  };

  const handleScoreChange = (val) => {
    setNewScore(val);
    setScoreError(validateScore(val));
  };

  const handleAddScore = async (e) => {
    e.preventDefault();
    const err = validateScore(newScore);
    if (err) { setScoreError(err); return; }
    try {
      if (editingScore) {
        await api.put(`/scores/${editingScore.id}`, { score: parseInt(newScore), score_date: scoreDate });
        toast.success('Score updated!');
      } else {
        await api.post('/scores', { score: parseInt(newScore), score_date: scoreDate });
        toast.success('Score submitted! Only your latest 5 are kept.');
      }
      setNewScore('');
      setScoreDate(new Date().toISOString().split('T')[0]);
      setScoreError('');
      setEditingScore(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save score');
    }
  };

  const handleEditScore = (score) => {
    setEditingScore(score);
    setNewScore(score.score.toString());
    setScoreDate(new Date(score.score_date || score.created_at).toISOString().split('T')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteScore = async (id) => {
    if (!window.confirm('Delete this score? It will no longer be used for the draw.')) return;
    try {
      await api.delete(`/scores/${id}`);
      toast.success('Score removed');
      fetchDashboardData();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const handleUploadProof = async (winnerId) => {
    const proofUrl = prompt('Paste the direct image URL of your winning scorecard:');
    if (!proofUrl) return;
    try {
      await api.post('/winners/upload-proof', { winnerId, proofImageUrl: proofUrl });
      toast.success('Proof submitted! Awaiting admin verification.');
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center mt-24 gap-4 text-gray-400">
        <Loader className="animate-spin text-emerald-500" size={40} />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">
          Welcome, <span className="text-emerald-400">{user.email.split('@')[0]}</span>
        </h1>
        <div className={`px-4 py-2 rounded-full border flex items-center gap-2 font-semibold text-sm ${sub.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
          {sub.status === 'active' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {sub.status === 'active' ? `Active Subscriber` : 'Not Subscribed'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Main Col (2/3) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subscription Gate */}
          {sub.status !== 'active' && user.role !== 'admin' ? (
            <div className="bg-dark-800 p-10 rounded-3xl border border-dark-700 text-center shadow-xl">
              <AlertCircle className="mx-auto text-red-400 mb-4" size={48} />
              <h2 className="text-2xl font-bold mb-3 text-white">Action Required</h2>
              <p className="text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
                You need an active subscription to submit scores and participate in lottery draws.
              </p>
              <Link to="/subscription" className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-10 rounded-2xl shadow-lg transition-all inline-block">
                Choose a Plan
              </Link>
            </div>
          ) : (
            <>
              {/* Score Entry */}
              <div className="bg-dark-800 p-8 rounded-3xl border border-dark-700">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                  <Target className="text-emerald-500" size={22} /> {editingScore ? 'Edit Score' : 'Submit Stableford Score'}
                </h2>
                <form onSubmit={handleAddScore} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Stableford Score (1-45)</label>
                      <input
                        type="number" min="1" max="45" required
                        value={newScore}
                        onChange={(e) => handleScoreChange(e.target.value)}
                        className={`w-full bg-dark-900 border rounded-2xl px-5 py-4 text-white focus:outline-none transition-all ${scoreError ? 'border-red-500 ring-2 ring-red-500/10' : 'border-dark-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10'}`}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Date Played</label>
                      <input
                        type="date" required
                        value={scoreDate}
                        onChange={(e) => setScoreDate(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-700 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-emerald-500 transition-all focus:ring-4 focus:ring-emerald-500/10"
                      />
                    </div>
                  </div>
                  {scoreError && <p className="text-red-400 text-sm font-medium flex items-center gap-1"><AlertCircle size={14} /> {scoreError}</p>}
                  
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={!!scoreError || !newScore}
                      className="flex-grow bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send size={18} /> {editingScore ? 'Update My Score' : 'Add to My List'}
                    </button>
                    {editingScore && (
                      <button 
                        type="button" 
                        onClick={() => { setEditingScore(null); setNewScore(''); }}
                        className="px-6 py-4 border border-dark-700 text-gray-400 hover:text-white rounded-2xl font-bold transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Score List */}
              <div className="bg-dark-800 p-8 rounded-3xl border border-dark-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Your Latest Scores</h2>
                  <span className="bg-dark-900 px-3 py-1 rounded-full text-xs font-bold text-gray-500 border border-dark-700">{scores.length} / 5</span>
                </div>
                {scores.length === 0 ? (
                  <div className="text-center py-10 text-gray-500 bg-dark-900/50 border border-dark-700 border-dashed rounded-2xl">
                    <Target size={40} className="mx-auto mb-4 text-dark-800" />
                    <p className="font-bold">No data yet</p>
                    <p className="text-sm">Submit your first score to qualify for draws.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {scores.map((s) => (
                      <div key={s.id} className="bg-dark-900 border border-dark-700 rounded-2xl p-5 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-black text-emerald-400">{s.score}</div>
                          <div>
                            <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Played On</p>
                            <p className="text-white font-bold">{new Date(s.score_date || s.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleEditScore(s)} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDeleteScore(s.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Winnings Section */}
          <div className="bg-dark-800 p-8 rounded-3xl border border-dark-700">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
              <Trophy className="text-yellow-500" size={22} /> Prize History
            </h2>
            {winnings.length === 0 ? (
               <div className="text-center py-10 text-gray-500 bg-dark-900/50 border border-dark-700 border-dashed rounded-2xl">
                 <Trophy size={40} className="mx-auto mb-4 text-dark-800" />
                 <p className="font-bold">No wins... yet!</p>
                 <p className="text-sm">Draw matching logic: Match 3, 4, or 5 numbers.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {winnings.map((win) => (
                  <div key={win.id} className="bg-dark-900 border border-dark-700 p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 px-4 py-2 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-bl-xl border-l border-b border-emerald-500/20">
                      {win.status}
                    </div>
                    <div className="flex flex-wrap justify-between items-end gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Won on Draw</p>
                        <p className="text-white font-bold">{new Date(win.draws.draw_date).toLocaleDateString()}</p>
                        <p className="text-3xl font-black text-yellow-400 mt-2">${win.prize_amount}</p>
                        <p className="text-xs text-gray-500 font-bold">{win.match_count} Lucky Matches</p>
                      </div>
                      {win.status === 'pending' && !win.proof_image_url && (
                        <button onClick={() => handleUploadProof(win.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-5 py-3 rounded-xl transition-all shadow-lg flex items-center gap-2">
                           <FileImage size={14} /> Claim Prize
                        </button>
                      )}
                      {win.proof_image_url && win.status === 'pending' && (
                        <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Reviewing Proof</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (1/3) */}
        <div className="space-y-8">
          {/* Next Draw Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all"></div>
            <Trophy className="mb-6 opacity-30 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700" size={48} />
            <p className="text-xs font-black uppercase tracking-[0.2em] mb-2 opacity-80">Next Jackpot Draw</p>
            <h3 className="text-3xl font-black mb-6 leading-tight">{getNextDrawDisplay()}</h3>
            <div className="bg-white/10 p-4 rounded-2xl border border-white/20 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-300" />
              <span className="font-bold text-sm">Status: Eligible</span>
            </div>
          </div>

          {/* Quick Stats/Settings */}
          <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 space-y-8">
            <h4 className="text-gray-500 font-black uppercase text-xs tracking-widest flex items-center gap-2">
              <Settings size={14} /> Member Portal
            </h4>
            
            <div className="space-y-3">
              <Link to="/subscription" className="w-full bg-dark-900 hover:bg-dark-700 p-5 rounded-2xl flex items-center justify-between group transition-all border border-dark-700">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 p-3 rounded-xl text-blue-500"><CreditCard size={18} /></div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">Subscription</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Plan & Billing</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>

              <Link to="/charity-select" className="w-full bg-dark-900 hover:bg-dark-700 p-5 rounded-2xl flex items-center justify-between group transition-all border border-dark-700">
                <div className="flex items-center gap-4">
                  <div className="bg-pink-500/10 p-3 rounded-xl text-pink-500"><Heart size={18} /></div>
                  <div className="text-left">
                    <p className="text-white font-bold text-sm">My Charity</p>
                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest">Update Support</p>
                  </div>
                </div>
                <ChevronRight className="text-gray-600 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </div>

            <div className="pt-8 border-t border-dark-700">
              <p className="text-xs text-gray-500 leading-relaxed italic">
                Platform fee is $10/mo. A minimum of 10% from every cycle goes towards your selected cause.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
