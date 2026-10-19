import { AlertOctagon, AlertTriangle, Info } from 'lucide-react';
import Badge from './Badge.jsx';
import { getProduct } from '../../data/c1MockData.js';
import { formatDateTime } from '../../utils/format.js';

export const SEVERITY = {
  critical: { label: 'Critical', icon: AlertOctagon, color: 'text-risk-critical', bg: 'bg-red-50' },
  high: { label: 'High', icon: AlertTriangle, color: 'text-risk-high', bg: 'bg-orange-50' },
  medium: { label: 'Medium', icon: Info, color: 'text-risk-medium', bg: 'bg-amber-50' },
};

// Compact alert row used in dashboard lists.
export default function AlertItem({ alert }) {
  const s = SEVERITY[alert.severity];
  const Icon = s.icon;
  return (
    <li className="flex gap-3 py-3">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-sm ${s.bg}`}>
        <Icon className={`h-5 w-5 ${s.color}`} aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-neutral-900">{alert.title}</p>
          <Badge variant={alert.severity}>{s.label}</Badge>
        </div>
        <p className="mt-0.5 text-xs text-neutral-700 sm:text-sm">{alert.message}</p>
        <p className="mt-1 text-xs text-neutral-400">
          {getProduct(alert.productId)?.name} · {formatDateTime(alert.date)}
        </p>
      </div>
    </li>
  );
}
