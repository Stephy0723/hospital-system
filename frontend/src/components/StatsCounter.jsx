export default function StatsCounter({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div key={i} className="text-center card rounded-2xl p-6 transition-all">
          {stat.icon && (
            <div className="w-10 h-10 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <stat.icon size={20} className="text-blue-500" />
            </div>
          )}
          <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">
            {stat.value}
          </div>
          <div className="text-xs md:text-sm text-muted">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
