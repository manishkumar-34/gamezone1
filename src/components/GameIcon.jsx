import { Club, Crown, Dices, Gem, Ghost, Puzzle, Rocket, Sparkles, Spade, Swords, Target, Trophy, Zap, Gamepad2 } from 'lucide-react';

const ICONS = { Club, Crown, Dices, Gem, Ghost, Puzzle, Rocket, Sparkles, Spade, Swords, Target, Trophy, Zap };

/* Self-contained generated game artwork (no external images). */
export default function GameIcon({ game, size = 'md' }) {
  const Icon = ICONS[game.icon] || Gamepad2;
  const [from, to] = game.colors;
  return (
    <div
      className={`game-icon game-icon--${size}`}
      style={{ background: `radial-gradient(circle at 30% 20%, ${from}, ${to} 75%)` }}
      role="img"
      aria-label={`${game.name} icon`}
    >
      <Icon className="game-icon__glyph" aria-hidden="true" />
      <span className="game-icon__line1">{game.words[0]}</span>
      <span className="game-icon__line2">{game.words[1]}</span>
    </div>
  );
}
