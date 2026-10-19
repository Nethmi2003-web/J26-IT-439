import { useState } from 'react';
import { CalendarClock, Download, Mail, Plus } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';
import { forecast, post2022Series, pre2022Series, products, reports, scheduledReports } from '../../data/c1MockData.js';
import { downloadCsv, mockExport } from '../../utils/download.js';
import { formatDate } from '../../utils/format.js';

// CSV is generated in the browser from mock data; PDF/Excel need the backend.
function handleDownload(report, format) {
  if (format === 'CSV' && report.id === 'pre-post-2022') {
    downloadCsv('c1-pre-post-2022.csv', [
      ...pre2022Series.map((r) => ({ period: 'pre-2022', month: r.month, actual_mt: r.actual, predicted_mt: r.predicted })),
      ...post2022Series.map((r) => ({ period: 'post-2022', month: r.month, actual_mt: r.actual, predicted_mt: r.predicted })),
    ]);
    return;
  }
  if (format === 'CSV') {
    downloadCsv(
      `c1-${report.id}.csv`,
      products.flatMap((p) => forecast[p.id].map((r) => ({ product: p.name, month: r.month, volume_mt: r.volume, value_usd: r.value }))),
    );
    return;
  }
  mockExport(format, report.title);
}

export default function C1Reports() {
  const [schedules, setSchedules] = useState(scheduledReports);

  const toggle = (id) => setSchedules((list) => list.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Reports</h1>
        <p className="caption mt-1">Download C1 reports or schedule them to be sent automatically.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {reports.map((r) => (
          <Card key={r.id} className="flex flex-col">
            <span className="text-3xl" aria-hidden>
              {r.emoji}
            </span>
            <h2 className="mt-3 font-semibold text-neutral-900">{r.title}</h2>
            <p className="caption mt-1">{r.description}</p>
            <p className="mt-3 text-xs text-neutral-400">Updated {formatDate(r.updated)}</p>
            <div className="mt-4 flex flex-col gap-3 sm:mt-auto sm:flex-row sm:flex-wrap sm:pt-4">
              {r.formats.map((f, i) => (
                <Button
                  key={f}
                  variant={i === 0 ? 'primary' : 'secondary'}
                  size="sm"
                  icon={Download}
                  onClick={() => handleDownload(r, f)}
                >
                  {f}
                </Button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card
        header="Scheduled Reports"
        subtitle="Reports sent automatically by email"
        actions={
          <Button variant="secondary" size="sm" icon={Plus} onClick={() => mockExport('Scheduling', 'a new report')}>
            New schedule
          </Button>
        }
      >
        <ul className="divide-y divide-neutral-200">
          {schedules.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-neutral-900">{s.name}</p>
                  <Badge variant={s.active ? 'success' : 'neutral'}>{s.active ? 'Active' : 'Paused'}</Badge>
                  <Badge variant="info">{s.format}</Badge>
                </div>
                <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-700 sm:text-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-4 w-4 text-neutral-400" aria-hidden /> {s.frequency}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-neutral-400" aria-hidden /> {s.recipients}
                  </span>
                </p>
              </div>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-sm text-neutral-700">
                <span>{s.active ? 'On' : 'Off'}</span>
                <span className="relative inline-flex">
                  <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={s.active}
                    onChange={() => toggle(s.id)}
                    aria-label={`Toggle ${s.name}`}
                  />
                  <span className="h-6 w-11 rounded-full bg-neutral-200 transition peer-checked:bg-primary-500 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-400" />
                  <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                </span>
              </label>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
