import type { ReactNode } from 'react';
import { Icon } from './Icon';
import type { IconName } from '@rwm/icons';

export function EmptyState({ icon = 'search', title, body, action }: { icon?: IconName; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="state">
      <Icon name={icon} size={36} color="var(--color-text-3)" strokeWidth={1.5} />
      <p className="t-title">{title}</p>
      {body ? <p className="muted t-label">{body}</p> : null}
      {action}
    </div>
  );
}

export function ErrorState({ title = "Couldn't load this", body = 'Check your connection and try again.', onRetry }: { title?: string; body?: string; onRetry?: () => void }) {
  return (
    <div className="state is-error" role="alert">
      <Icon name="alert" size={36} color="var(--color-danger)" strokeWidth={1.5} />
      <p className="t-title">{title}</p>
      <p className="muted t-label">{body}</p>
      {onRetry ? (
        <button className="btn btn-sm" onClick={onRetry}>
          Retry
        </button>
      ) : null}
    </div>
  );
}

export function VehicleCardSkeleton() {
  return (
    <div className="vcard" aria-hidden="true">
      <div className="skeleton" style={{ height: 176, borderRadius: 0 }} />
      <div className="vcard-body">
        <div className="skeleton" style={{ height: 18, width: '75%' }} />
        <div className="skeleton" style={{ height: 14, width: '55%' }} />
        <div className="skeleton" style={{ height: 24, width: '40%', marginTop: 8 }} />
      </div>
    </div>
  );
}
