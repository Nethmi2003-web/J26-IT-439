// White card. `header` can be a string (rendered as a title) or any node.
export default function Card({ header, subtitle, actions, children, className = '', bodyClassName = '' }) {
  return (
    <section className={`min-w-0 rounded-md bg-white p-3 shadow-card sm:p-4 lg:p-6 ${className}`}>
      {(header || actions) && (
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            {typeof header === 'string' ? (
              <h2 className="text-base font-semibold text-neutral-900 sm:text-lg">{header}</h2>
            ) : (
              header
            )}
            {subtitle && <p className="caption mt-0.5 text-neutral-400">{subtitle}</p>}
          </div>
          {actions && <div className="flex flex-col gap-3 sm:flex-row sm:items-center">{actions}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
