import { Construction } from 'lucide-react';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';

// Simple page for routes that exist in the navigation but are not built yet.
export default function PlaceholderPage({ title, description }) {
  return (
    <div className="page">
      <h1 className="page-title">{title}</h1>
      <Card>
        <div className="flex flex-col items-center py-10 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-primary-100">
            <Construction className="h-7 w-7 text-primary-500" aria-hidden />
          </span>
          <p className="mt-4 max-w-md text-sm text-neutral-700 sm:text-base">{description}</p>
          <div className="mt-6">
            <Button to="/dashboard" variant="secondary">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
