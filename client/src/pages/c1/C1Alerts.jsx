import { useState } from 'react';
import { BellOff, RotateCcw, SlidersHorizontal } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { SEVERITY } from '../../components/ui/AlertItem.jsx';
import { alerts as allAlerts, getProduct } from '../../data/c1MockData.js';
import { formatDateTime } from '../../utils/format.js';

const SEVERITY_ORDER = ['critical', 'high', 'medium'];
const TABS = [{ id: 'all', label: 'All' }, ...SEVERITY_ORDER.map((s) => ({ id: s, label: SEVERITY[s].label }))];

const groupStyles = {
  critical: 'border-l-risk-critical',
  high: 'border-l-risk-high',
  medium: 'border-l-risk-medium',
};

export default function C1Alerts() {
  const [tab, setTab] = useState('all');
  const [dismissed, setDismissed] = useState([]);

  const visible = allAlerts.filter((a) => !dismissed.includes(a.id));
  const counts = Object.fromEntries(SEVERITY_ORDER.map((s) => [s, visible.filter((a) => a.severity === s).length]));
  const groups = SEVERITY_ORDER.filter((s) => tab === 'all' || tab === s);

  return (
    <div className="page">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Alerts Center</h1>
          <p className="caption mt-1">Early-warning alerts generated from C1 export forecasts.</p>
        </div>
        <Button to="/settings" variant="secondary" icon={SlidersHorizontal}>
          Alert threshold settings
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto" role="tablist" aria-label="Filter by severity">
          {TABS.map((t) => {
            const count = t.id === 'all' ? visible.length : counts[t.id];
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t.id)}
                className={`flex min-h-[44px] items-center gap-2 rounded-sm px-4 text-sm font-medium ${
                  active ? 'bg-primary-500 text-white' : 'bg-white text-neutral-700 shadow-card md:hover:bg-neutral-200'
                }`}
              >
                {t.label}
                <span
                  className={`rounded-full px-2 text-xs ${active ? 'bg-white/20' : 'bg-neutral-100 text-neutral-700'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {dismissed.length > 0 && (
        <div className="flex flex-col gap-3 rounded-sm bg-white p-3 text-sm shadow-card sm:flex-row sm:items-center sm:justify-between">
          <span className="text-neutral-700">{dismissed.length} alert(s) dismissed.</span>
          <Button variant="ghost" size="sm" icon={RotateCcw} onClick={() => setDismissed([])}>
            Restore all
          </Button>
        </div>
      )}

      {groups.map((severity) => {
        const items = visible.filter((a) => a.severity === severity);
        const s = SEVERITY[severity];
        const Icon = s.icon;
        return (
          <section key={severity} aria-labelledby={`group-${severity}`}>
            <h2 id={`group-${severity}`} className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide">
              <Icon className={`h-5 w-5 ${s.color}`} aria-hidden />
              <span className={s.color}>{s.label}</span>
              <span className="text-neutral-400">({items.length})</span>
            </h2>

            {items.length === 0 ? (
              <Card>
                <p className="flex items-center justify-center gap-2 py-2 text-sm text-neutral-400">
                  <BellOff className="h-4 w-4" aria-hidden /> No {s.label.toLowerCase()} alerts.
                </p>
              </Card>
            ) : (
              <ul className="space-y-3">
                {items.map((a) => {
                  const product = getProduct(a.productId);
                  return (
                    <li key={a.id} className={`rounded-md border-l-4 bg-white p-3 shadow-card sm:p-4 ${groupStyles[severity]}`}>
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant={severity}>{s.label}</Badge>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-700">
                              <span className="h-2 w-2 rounded-full" style={{ background: product.color }} />
                              {product.name}
                            </span>
                          </div>
                          <h3 className="mt-2 font-semibold text-neutral-900">{a.title}</h3>
                          <p className="mt-0.5 text-sm text-neutral-700">{a.message}</p>
                          <p className="mt-1 text-xs text-neutral-400">{formatDateTime(a.date)}</p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                          <Button to={`/c1/product/${a.productId}`} variant="secondary" size="sm">
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDismissed((d) => [...d, a.id])}>
                            Dismiss
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
}
