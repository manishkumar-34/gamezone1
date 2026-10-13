import { Gamepad2 } from 'lucide-react';

export default function Logo({ size = 'md', tagline = false }) {
  return (
    <div className={`logo logo--${size}`}>
      <span className="logo__mark" aria-hidden="true">
        <Gamepad2 />
      </span>
      <span className="logo__word">
        Play<span>Zone</span>
      </span>
      {tagline && <span className="logo__tag">Play more · Enjoy more</span>}
    </div>
  );
}
