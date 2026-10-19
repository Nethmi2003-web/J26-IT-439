import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';

// trend: 'up' | 'down' | 'flat'. `trendGood` says whether that direction is good news.
export default function StatCard({ icon: Icon, label, value, trend, trendLabel, trendGood, iconClass = 'bg-primary-100 text-primary-600' }) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus;
  const good = trendGood ?? trend === 'up';
  const trendColor = trend === 'flat' ? 'text-neutral-700' : good ? 'text-risk-low' : 'text-risk-critical';

  return (
    <div className="min-w-0 rounded-md bg-white p-3 shadow-card sm:p-4 lg:p-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-sm ${iconClass}`}>
            <Icon className="h-5 w-5" aria-hidden />
          </span>
        )}
        <p className="caption font-medium">{label}</p>
      </div>
      <p className="mt-3 truncate text-2xl font-bold text-neutral-900 lg:text-3xl">{value}</p>
      {trendLabel && (
        <p className={`mt-1 flex items-center gap-1 text-xs font-medium sm:text-sm ${trendColor}`}>
          {trend && <TrendIcon className="h-4 w-4 shrink-0" aria-hidden />}
          <span className="truncate">{trendLabel}</span>
        </p>
      )}
    </div>
  );
}
