import { useEffect, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bell, ChevronDown, Leaf, LogOut, Menu, Search, Settings, User } from 'lucide-react';
import { currentUser } from '../../data/c1MockData.js';

const navLinks = [
  { label: 'Home', to: '/dashboard' },
  { label: 'C1', to: '/c1' },
  { label: 'C2', disabled: true },
  { label: 'C3', disabled: true },
  { label: 'C4', disabled: true },
  { label: 'About', to: '/about' },
];

export default function Header({ onMenuClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the avatar dropdown when clicking outside it.
  useEffect(() => {
    if (!menuOpen) return undefined;
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 md:h-16 md:px-6">
      {/* Left: hamburger + logo */}
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onMenuClick}
          className="-ml-2 grid h-11 w-11 place-items-center rounded-sm text-neutral-700 active:bg-neutral-100 md:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/dashboard" className="flex min-w-0 items-center gap-2">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm bg-primary-100">
            <Leaf className="h-5 w-5 text-primary-500" aria-hidden />
          </span>
          <span className="truncate text-base font-bold text-neutral-900 md:text-lg">
            CoconutRisk <span className="text-primary-500">AI</span>
          </span>
        </Link>
      </div>

      {/* Center: main nav (md+) */}
      <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
        {navLinks.map((link) =>
          link.disabled ? (
            <span
              key={link.label}
              title="Coming Soon"
              className="cursor-not-allowed rounded-sm px-3 py-2 text-sm font-medium text-neutral-400"
            >
              {link.label}
            </span>
          ) : (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-100 text-primary-600' : 'text-neutral-700 md:hover:bg-neutral-100'
                }`
              }
            >
              {link.label}
            </NavLink>
          ),
        )}
      </nav>

      {/* Right: search, notifications, user */}
      <div className="flex items-center gap-1 sm:gap-2">
        <button
          type="button"
          className="hidden h-10 w-10 place-items-center rounded-sm text-neutral-700 md:hover:bg-neutral-100 sm:grid"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>

        <Link
          to="/c1/alerts"
          className="relative grid h-11 w-11 place-items-center rounded-sm text-neutral-700 active:bg-neutral-100 md:h-10 md:w-10 md:hover:bg-neutral-100"
          aria-label="Alerts"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-risk-critical ring-2 ring-white" />
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex min-h-[44px] items-center gap-1 rounded-sm pl-1 pr-1 md:hover:bg-neutral-100"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="User menu"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-500 text-xs font-semibold text-white md:h-9 md:w-9">
              {currentUser.initials}
            </span>
            <ChevronDown className="hidden h-4 w-4 text-neutral-400 sm:block" aria-hidden />
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-neutral-200 bg-white py-1 shadow-lg"
            >
              <div className="border-b border-neutral-200 px-4 py-3">
                <p className="text-sm font-semibold text-neutral-900">{currentUser.name}</p>
                <p className="text-xs text-neutral-400">{currentUser.role}</p>
              </div>
              {[
                { label: 'Profile', to: '/profile', icon: User },
                { label: 'Settings', to: '/settings', icon: Settings },
              ].map(({ label, to, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  role="menuitem"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-[44px] items-center gap-3 px-4 text-sm text-neutral-700 md:hover:bg-neutral-100"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {label}
                </Link>
              ))}
              <button
                type="button"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex min-h-[44px] w-full items-center gap-3 border-t border-neutral-200 px-4 text-sm text-risk-critical md:hover:bg-neutral-100"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
