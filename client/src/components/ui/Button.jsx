import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-primary-500 text-white md:hover:bg-primary-600 active:bg-primary-600',
  secondary: 'border border-neutral-200 bg-white text-neutral-900 md:hover:bg-neutral-100 active:bg-neutral-100',
  ghost: 'text-primary-500 md:hover:bg-primary-100 active:bg-primary-100',
};

const sizes = {
  sm: 'min-h-[44px] px-3 text-sm md:min-h-[36px]',
  md: 'min-h-[44px] px-4 text-sm sm:text-base',
  lg: 'min-h-[48px] px-6 text-base',
};

// Renders a <Link> when `to` is given, otherwise a <button>.
// Full width on mobile unless `fullWidth={false}`.
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  icon: Icon,
  iconRight: IconRight,
  fullWidth = true,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors',
    'disabled:cursor-not-allowed disabled:opacity-50',
    fullWidth ? 'w-full sm:w-auto' : '',
    variants[variant],
    sizes[size],
    className,
  ].join(' ');

  const content = (
    <>
      {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />}
      {children}
      {IconRight && <IconRight className="h-4 w-4 shrink-0" aria-hidden />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
