import { Search, Heart, ShieldCheck, Target, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HowItWorks() {
  const steps = [
    {
      title: 'Join & Support',
      desc: 'Subscribe for a small monthly fee. Part of your fee goes directly to your chosen charity.',
      icon: Heart,
      color: 'text-pink-500'
    },
    {
      title: 'Enter Golf Scores',
      desc: 'Log up to 5 of your latest Stableford golf scores. These act as your lucky numbers.',
      icon: Target,
      color: 'text-emerald-500'
    },
    {
      title: 'Participate in Draw',
      desc: 'Every month, 5 random numbers are drawn. If your scores match, you win!',
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      title: 'Secure & Verified',
      desc: 'Winners upload proof of their scores, ensuring a fair and transparent system for everyone.',
      icon: ShieldCheck,
      color: 'text-blue-500'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
          How It All Works
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto">
          Our platform combines the thrill of a lottery with a passion for golf and a spirit of giving.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
        {steps.map((step, i) => (
          <div key={i} className="bg-dark-800 p-8 rounded-3xl border border-dark-700 hover:border-emerald-500/50 transition-all flex flex-col group relative">
            <div className="bg-dark-900 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-dark-700 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
              <step.icon className={step.color} size={28} />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-white">{step.title}</h3>
            <p className="text-gray-400 leading-relaxed mb-6 flex-grow">{step.desc}</p>
            <div className="flex items-center text-emerald-500 font-semibold gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              Step {i + 1} <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-800/20 rounded-full blur-3xl"></div>
        <h2 className="text-4xl font-bold mb-6 relative">Ready to win for a cause?</h2>
        <p className="text-emerald-50 text-xl mb-10 max-w-2xl mx-auto relative opacity-90">
          Join thousands of golfers making an impact with every swing. Your journey starts today.
        </p>
        <Link to="/register" className="inline-flex items-center gap-2 bg-white text-emerald-600 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 relative">
          Get Started Now <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
