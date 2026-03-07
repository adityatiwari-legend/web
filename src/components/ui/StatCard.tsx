interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'green' | 'blue' | 'amber' | 'red' | 'purple' | 'yellow';
}

const colorMap = {
  green: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  yellow: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'green',
}: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trendValue && (
            <p
              className={`text-sm mt-2 font-medium ${
                trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : trend === 'down' ? 'text-red-600 dark:text-red-400' : 'text-gray-500'
              }`}
            >
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg border ${colorMap[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
