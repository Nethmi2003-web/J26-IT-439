import { Link } from 'react-router-dom';
import { Leaf, Mail, MapPin } from 'lucide-react';

const components = [
  { label: 'C1 – Export Forecasting', to: '/c1' },
  { label: 'C2 – Crown Detection' },
  { label: 'C3 – Drought Risk' },
  { label: 'C4 – Spatial Propagation' },
];

const resources = [
  { label: 'Model Comparison', to: '/c1/models' },
  { label: 'Reports', to: '/c1/reports' },
  { label: 'Alerts Center', to: '/c1/alerts' },
  { label: 'About the Project', to: '/about' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="grid grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-primary-400" aria-hidden />
            <span className="font-bold">CoconutRisk AI</span>
          </div>
          <p className="mt-3 text-sm text-neutral-400">
            AI-driven risk intelligence for the Sri Lankan coconut industry: export forecasting, crown health,
            drought risk and disease spread.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Components</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {components.map((c) => (
              <li key={c.label}>
                {c.to ? (
                  <Link to={c.to} className="text-neutral-200 md:hover:text-white">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-neutral-400" title="Coming Soon">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Resources</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {resources.map((r) => (
              <li key={r.label}>
                <Link to={r.to} className="text-neutral-200 md:hover:text-white">
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-neutral-200">
            <li className="flex items-start gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
              research@coconutrisk.ai
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" aria-hidden />
              Sri Lanka
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-neutral-400 sm:px-6 lg:px-8">
        © 2026 CoconutRisk AI. All rights reserved.
      </div>
    </footer>
  );
}
