import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ServiceCard({ icon: Icon, title, description, color = 'blue' }) {
  const colorMap = {
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/10 hover:border-blue-500/25',
    cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/10 hover:border-cyan-500/25',
    emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/10 hover:border-emerald-500/25',
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/10 hover:border-purple-500/25',
    rose: 'from-rose-500/10 to-rose-600/5 border-rose-500/10 hover:border-rose-500/25',
    amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/10 hover:border-amber-500/25',
  };

  const iconColorMap = {
    blue: 'text-blue-400',
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    purple: 'text-purple-400',
    rose: 'text-rose-400',
    amber: 'text-amber-400',
  };

  const bgIconMap = {
    blue: 'bg-blue-500/10 group-hover:bg-blue-500/15',
    cyan: 'bg-cyan-500/10 group-hover:bg-cyan-500/15',
    emerald: 'bg-emerald-500/10 group-hover:bg-emerald-500/15',
    purple: 'bg-purple-500/10 group-hover:bg-purple-500/15',
    rose: 'bg-rose-500/10 group-hover:bg-rose-500/15',
    amber: 'bg-amber-500/10 group-hover:bg-amber-500/15',
  };

  const glowMap = {
    blue: 'group-hover:shadow-blue-500/10',
    cyan: 'group-hover:shadow-cyan-500/10',
    emerald: 'group-hover:shadow-emerald-500/10',
    purple: 'group-hover:shadow-purple-500/10',
    rose: 'group-hover:shadow-rose-500/10',
    amber: 'group-hover:shadow-amber-500/10',
  };

  return (
    <Link to="/services" className={`group relative rounded-2xl bg-gradient-to-b ${colorMap[color]} border p-7 transition-all duration-400 hover:shadow-xl ${glowMap[color]} cursor-pointer block`}
      style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
      onMouseMove={e => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.transform = `perspective(800px) rotateY(${((e.clientX - rect.left) / rect.width - 0.5) * 4}deg) rotateX(${((e.clientY - rect.top) / rect.height - 0.5) * -4}deg) translateY(-4px)`;
      }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-xl ${bgIconMap[color]} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
          <Icon size={22} className={iconColorMap[color]} strokeWidth={2} />
        </div>
        <ArrowUpRight size={16} className="text-faint opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300" />
      </div>
      <h3 className="text-lg font-bold text-heading mb-2 group-hover:text-gradient-premium transition-all">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{description}</p>
    </Link>
  );
}
