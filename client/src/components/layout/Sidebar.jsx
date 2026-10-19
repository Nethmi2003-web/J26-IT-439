import { NavLink, useLocation } from 'react-router-dom';
import {
  AlertTriangle, BarChart3, CloudRain, FileText, Home, Image, Map, Search, Settings, User, X,
} from 'lucide-react';

const navItems = [
  { label: 'Home / Dashboard', icon: Home, to: '/dashboard' },
  { label: 'C1 – Export Forecasting', icon: BarChart3, to: '/c1/dashboard', component: 'C1' },
  { label: 'C2 – Crown Detection', icon: Image, disabled: true, component: 'C2' },
  { label: 'C3 – Drought Risk', icon: CloudRain, disabled: true, component: 'C3' },
  { label: 'C4 – Spatial Propagation', icon: Map, disabled: true, component: 'C4' },
  { label: 'Alerts Center', icon: AlertTriangle, to: '/c1/alerts' },
  { label: 'Reports', icon: FileText, to: '/c1/reports' },
  { label: 'Profile', icon: User, to: '/profile' },
  { label: 'Settings', icon: Settings, to: '/settings' },
];

// Sub-pages shown under C1 while the user is inside the C1 module.
const c1SubItems = [
  { label: 'Overview', to: '/c1' },
  { label: 'Dashboard', to: '/c1/dashboard' },
  { label: 'Model Comparison', to: '/c1/models' },
];

const baseItem = 'flex min-h-[44px] items-center gap-3 rounded-lg border-l-[3px] px-3 text-sm transition-colors';
const activeItem = 'border-primary-500 bg-primary-100 font-semibold text-primary-600';
const idleItem = 'border-transparent text-neutral-700 md:hover:bg-neutral-100 active:bg-neutral-100';

export default function Sidebar({ isOpen, onClose, activeComponent = 'C1' }) {
  const { pathname } = useLocation();

  // The C1 entry stays active on every C1 page except Alerts and Reports, which have their own items.
  const inC1 = pathname.startsWith('/c1') && !pathname.startsWith('/c1/alerts') && !pathname.startsWith('/c1/reports');

  const closeOnMobile = () => {
    if (window.innerWidth < 768) onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={onClose} aria-hidden />}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 md:top-16 md:z-30 md:h-[calc(100vh-4rem)] md:w-60 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        {/* Mobile drawer header */}
        <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-4 md:hidden">
          <span className="font-bold text-neutral-900">
            CoconutRisk <span className="text-primary-500">AI</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 grid h-11 w-11 place-items-center rounded-sm text-neutral-700 active:bg-neutral-100"
            aria-label="Close navigation menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search lives in the drawer on small screens */}
        <div className="px-3 pt-3 sm:hidden">
          <label className="flex min-h-[44px] items-center gap-2 rounded-sm border border-neutral-200 px-3">
            <Search className="h-4 w-4 text-neutral-400" aria-hidden />
            <span className="sr-only">Search</span>
            <input type="search" placeholder="Search…" className="w-full bg-transparent outline-none" />
          </label>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Sections">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.disabled) {
              return (
                <span
                  key={item.label}
                  title="Coming Soon"
                  aria-disabled="true"
                  className={`${baseItem} cursor-not-allowed border-transparent text-neutral-400`}
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </span>
              );
            }

            const isC1 = item.component === 'C1';
            return (
              <div key={item.label}>
                <NavLink
                  to={item.to}
                  onClick={closeOnMobile}
                  className={({ isActive }) =>
                    `${baseItem} ${(isC1 ? inC1 && activeComponent === 'C1' : isActive) ? activeItem : idleItem}`
                  }
                >
                  <Icon className="h-5 w-5 shrink-0" aria-hidden />
                  <span className="truncate">{item.label}</span>
                </NavLink>

                {isC1 && inC1 && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-neutral-200 pl-3">
                    {c1SubItems.map((sub) => (
                      <NavLink
                        key={sub.to}
                        to={sub.to}
                        end
                        onClick={closeOnMobile}
                        className={({ isActive }) =>
                          `flex min-h-[44px] items-center rounded-sm px-3 text-sm md:min-h-[36px] ${
                            isActive ? 'font-semibold text-primary-600' : 'text-neutral-700 md:hover:bg-neutral-100'
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-neutral-200 p-4 text-xs text-neutral-400">
          C2–C4 modules coming soon
        </div>
      </aside>
    </>
  );
}
