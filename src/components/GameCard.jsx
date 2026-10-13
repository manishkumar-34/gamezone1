import { Heart, Star } from 'lucide-react';
import GameIcon from './GameIcon.jsx';

export default function GameCard({ game, isFavorite, onToggleFavorite, onOpen }) {
  return (
    <article className="game-card">
      <button type="button" className="game-card__open" onClick={() => onOpen(game)} aria-label={`View details for ${game.name}`}>
        <div className="game-card__art">
          <GameIcon game={game} />
          {game.tag && (
            <span className={`badge badge--${game.tag === 'NEW' ? 'new' : 'hot'}`}>{game.tag === 'NEW' ? 'NEW' : 'HOT'}</span>
          )}
        </div>
      </button>
      <div className="game-card__body">
        <div className="game-card__row">
          <h3 className="game-card__name">{game.name}</h3>
          <button
            type="button"
            className={`icon-btn icon-btn--sm${isFavorite ? ' is-active' : ''}`}
            onClick={() => onToggleFavorite(game.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
          >
            <Heart fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        <p className="game-card__rating">
          <Star className="star" fill="currentColor" aria-hidden="true" />
          <span>{game.rating.toFixed(1)}</span>
          {game.tag === 'TRENDING' && <span className="trend-pill">Trending</span>}
        </p>
        <p className="game-card__cat">{game.category}</p>
      </div>
    </article>
  );
}
