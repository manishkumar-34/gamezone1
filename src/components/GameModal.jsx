import { useEffect, useRef } from 'react';
import { Heart, Play, ShieldCheck, Star, X } from 'lucide-react';
import GameIcon from './GameIcon.jsx';

export default function GameModal({ game, isFavorite, onToggleFavorite, onClose, onPlay }) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
    };
  }, [onClose]);

  const facts = [
    ['Category', game.category],
    ['Size', game.size],
    ['Players', game.players],
    ['Last update', game.updated],
  ];

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" ref={dialogRef}>
        <button type="button" className="icon-btn modal__close" onClick={onClose} ref={closeRef} aria-label="Close game details">
          <X />
        </button>
        <div className="modal__head">
          <GameIcon game={game} size="lg" />
          <div>
            <h2 id="modal-title" className="modal__title">{game.name}</h2>
            <p className="modal__rating">
              <Star className="star" fill="currentColor" aria-hidden="true" />
              <strong>{game.rating.toFixed(1)}</strong>
              <span>({game.reviews} reviews)</span>
            </p>
          </div>
        </div>

        <dl className="facts">
          {facts.map(([k, v]) => (
            <div key={k} className="facts__row">
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>

        <div className="modal__actions">
          <button type="button" className="btn btn--primary btn--grow" onClick={() => onPlay(game)}>
            <Play /> Play now (demo)
          </button>
          <button
            type="button"
            className={`icon-btn icon-btn--lg${isFavorite ? ' is-active' : ''}`}
            onClick={() => onToggleFavorite(game.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
          >
            <Heart fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="modal__desc">{game.description}</p>
        <p className="modal__note">
          <ShieldCheck aria-hidden="true" /> Demo listing only. No real money, deposits, or payouts are involved.
        </p>
      </div>
    </div>
  );
}
