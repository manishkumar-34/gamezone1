import { ArrowRight, Gamepad2 } from 'lucide-react';

export default function Banner({ onExplore }) {
  return (
    <section className="banner" aria-labelledby="banner-title">
      <div className="banner__text">
        <p className="banner__welcome">Welcome to</p>
        <h1 id="banner-title" className="banner__title">Play<span>Zone</span></h1>
        <p className="banner__sub">Discover amazing games and enjoy endless fun. Your ultimate gaming destination.</p>
        <button type="button" className="btn btn--primary" onClick={onExplore}>
          Explore Games <ArrowRight />
        </button>
      </div>
      <div className="banner__art" aria-hidden="true">
        <Gamepad2 className="banner__pad" />
        <div className="banner__words">
          <span>PLAY</span><span>MORE</span><span>ENJOY</span><span>MORE</span>
        </div>
      </div>
    </section>
  );
}
