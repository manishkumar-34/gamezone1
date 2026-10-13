import { SearchX } from 'lucide-react';

export default function EmptyState({ icon: Icon = SearchX, title, message, actionLabel, onAction }) {
  return (
    <div className="empty" role="status">
      <span className="empty__icon" aria-hidden="true"><Icon /></span>
      <h3>{title}</h3>
      <p>{message}</p>
      {actionLabel && (
        <button type="button" className="btn btn--outline" onClick={onAction}>{actionLabel}</button>
      )}
    </div>
  );
}
