import { ArrowRight, BarChart3, Droplet, Droplets, Globe2, Nut, Sprout, TreePalm } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { models, productSummary, products } from '../../data/c1MockData.js';
import { formatMt, formatPercent, formatUsd } from '../../utils/format.js';

const productIcons = {
  'coconut-oil': Droplet,
  vco: Droplets,
  dc: Sprout,
  copra: Nut,
  'fresh-nuts': TreePalm,
};

export default function C1Overview() {
  const best = models.find((m) => m.best);

  return (
    <div className="page">
      {/* Hero */}
      <section className="overflow-hidden rounded-lg bg-gradient-to-br from-primary-600 to-primary-500 p-5 text-white shadow-card sm:p-8 lg:p-10">
        <Badge variant="neutral" className="bg-white/15 text-white ring-white/30">
          Component 1
        </Badge>
        <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Multi-Product Export Forecasting
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-white/85 sm:text-base">
          Monthly export volume and value forecasts for five Sri Lankan coconut products, with 95% prediction
          intervals, early-warning alerts and model comparison across the pre- and post-2022 periods.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button to="/c1/dashboard" size="lg" className="bg-white !text-primary-600 md:hover:bg-primary-100" iconRight={ArrowRight}>
            View Dashboard
          </Button>
          <Button to="/c1/models" size="lg" variant="ghost" className="!text-white ring-1 ring-white/40 md:hover:bg-white/10">
            Compare Models
          </Button>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-white/20 pt-6 sm:grid-cols-4">
          {[
            ['Products', products.length],
            ['Forecast horizon', '6 months'],
            ['Best model', best.name],
            ['Best MAPE', `${best.mape}%`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs text-white/70 sm:text-sm">{k}</dt>
              <dd className="text-lg font-semibold sm:text-xl">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Products */}
      <div>
        <h2 className="section-title">Products</h2>
        <p className="caption mt-1">Last 12 months of exports and year-over-year change.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 lg:gap-6">
        {products.map((p) => {
          const Icon = productIcons[p.id];
          const s = productSummary(p.id);
          return (
            <Card key={p.id} className="flex flex-col">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-sm" style={{ background: `${p.color}1A` }}>
                  <Icon className="h-6 w-6" style={{ color: p.color }} aria-hidden />
                </span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-neutral-900">{p.name}</h3>
                  <p className="caption mt-0.5">{p.description}</p>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 rounded-sm bg-neutral-100 p-3 text-center">
                <div>
                  <dt className="text-xs text-neutral-400">Volume</dt>
                  <dd className="text-sm font-semibold">{formatMt(s.volume12).replace(' MT', '')}</dd>
                </div>
                <div>
                  <dt className="text-xs text-neutral-400">Value</dt>
                  <dd className="text-sm font-semibold">{formatUsd(s.value12)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-neutral-400">YoY</dt>
                  <dd className={`text-sm font-semibold ${s.yoyVolume >= 0 ? 'text-risk-low' : 'text-risk-critical'}`}>
                    {formatPercent(s.yoyVolume, 1, true)}
                  </dd>
                </div>
              </dl>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-neutral-700">
                <Globe2 className="h-3.5 w-3.5 text-neutral-400" aria-hidden />
                {p.markets.join(', ')}
              </p>
              <div className="mt-4 pt-1 sm:mt-auto">
                <Button to={`/c1/product/${p.id}`} variant="secondary" size="sm" iconRight={ArrowRight}>
                  View
                </Button>
              </div>
            </Card>
          );
        })}

        {/* CTA card */}
        <Card className="flex flex-col items-start justify-center border-2 border-dashed border-primary-400 bg-primary-100/30 shadow-none">
          <BarChart3 className="h-8 w-8 text-primary-500" aria-hidden />
          <h3 className="mt-3 font-semibold text-neutral-900">See all forecasts</h3>
          <p className="caption mt-1">Interactive forecasts, intervals, and alerts in one place.</p>
          <div className="mt-4 w-full sm:w-auto">
            <Button to="/c1/dashboard" iconRight={ArrowRight}>
              View Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
