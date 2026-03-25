import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, CheckCircle2, XCircle, Loader, Calendar, ShieldCheck, ArrowRight, Wallet } from 'lucide-react';
import { toast } from '../components/Toast';

export default function Subscription() {
  const { user } = useAuth();
  const [sub, setSub] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await api.get('/subscriptions/status');
      setSub(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type) => {
    setProcessing(true);
    try {
      if (type === 'cancel') {
        if (!window.confirm('Are you sure you want to cancel your active subscription? You will lose access to monthly draws.')) return;
        await api.post('/subscriptions/cancel');
        toast.success('Subscription cancelled successfully');
      } else {
        await api.post('/subscriptions', { type });
        toast.success(`Subscribed to ${type} plan!`);
      }
      fetchStatus();
    } catch (err) {
      toast.error('Action failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="flex justify-center mt-20"><Loader className="animate-spin text-emerald-500" size={40} /></div>;

  const isActive = sub?.subscription_status === 'active';

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Membership <span className="text-emerald-500">Center</span></h1>
        <p className="text-gray-400">Manage your subscription, billing, and draw eligibility.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Status Card */}
        <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8 flex flex-col relative overflow-hidden group">
          <div className={`absolute top-0 right-0 p-3 px-6 rounded-bl-3xl text-xs font-black uppercase tracking-widest ${isActive ? 'bg-emerald-500 text-white' : 'bg-red-500/20 text-red-500'}`}>
            {isActive ? 'Active' : 'Expired'}
          </div>
          
          <div className="mb-8">
            <p className="text-gray-500 text-sm font-bold uppercase mb-2">Current Plan</p>
            <p className="text-3xl font-black text-white capitalize">{isActive ? `${sub.subscription_type} Plan` : 'No Active Plan'}</p>
          </div>

          <div className="space-y-4 mb-10 flex-grow">
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Full Draw Eligibility</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <CheckCircle2 size={18} className="text-emerald-500" />
              <span>Score Tracking Analytics</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>Verified Charity Support</span>
            </div>
          </div>

          {isActive && (
            <div className="pt-6 border-t border-dark-700">
              <div className="flex items-center gap-2 text-gray-500 mb-6 font-medium">
                <Calendar size={16} /> Renews: {new Date(sub.subscription_end).toLocaleDateString()}
              </div>
              <button 
                onClick={() => handleAction('cancel')}
                disabled={processing}
                className="w-full py-3 text-red-500 font-bold border border-red-500/30 rounded-xl hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
              >
                Cancel Subscription
              </button>
            </div>
          )}
        </div>

        {/* Action/Plans Card */}
        <div className="bg-dark-800 rounded-3xl border border-dark-700 p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Wallet className="text-emerald-500" /> {isActive ? 'Manage Billing' : 'Choose a Plan'}
          </h3>

          {!isActive ? (
            <div className="space-y-4">
               <button 
                onClick={() => handleAction('monthly')}
                disabled={processing}
                className="w-full bg-emerald-600 hover:bg-emerald-500 p-6 rounded-2xl transition-all flex justify-between items-center group"
               >
                 <div className="text-left">
                   <p className="font-bold text-white text-lg">Monthly Plan</p>
                   <p className="text-emerald-200 text-sm">Cancel anytime</p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-black text-white">$10</p>
                   <p className="text-emerald-200 text-xs text-right">/mo</p>
                 </div>
               </button>

               <button 
                onClick={() => handleAction('yearly')}
                disabled={processing}
                className="w-full bg-dark-900 border border-dark-700 border-t-emerald-500/50 hover:bg-dark-700 p-6 rounded-2xl transition-all flex justify-between items-center group relative overflow-hidden"
               >
                 <div className="absolute top-0 right-0 bg-yellow-500 text-dark-900 text-[10px] px-3 font-bold py-1">SAVE 20%</div>
                 <div className="text-left">
                   <p className="font-bold text-white text-lg">Yearly Plan</p>
                   <p className="text-gray-500 text-sm">Best value choice</p>
                 </div>
                 <div className="text-right">
                   <p className="text-2xl font-black text-white">$100</p>
                   <p className="text-gray-500 text-xs text-right">/yr</p>
                 </div>
               </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-dark-900 p-6 rounded-2xl border border-dark-700">
                <p className="text-sm text-gray-500 mb-2">Saved Payment Method</p>
                <div className="flex items-center gap-3 text-white font-bold">
                  <CreditCard className="text-emerald-500" /> •••• •••• 4242
                </div>
              </div>
              <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-4 rounded-xl text-sm border border-yellow-500/20 leading-relaxed font-medium">
                <ShieldCheck size={24} className="flex-shrink-0" />
                Payments are securely processed via Stripe simulation. No real money is being charged.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
