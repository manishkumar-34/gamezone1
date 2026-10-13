import { Clock, Crown, Heart, Home, LayoutGrid, LogOut, Settings, HelpCircle, Trophy, User, X } from 'lucide-react';
import Logo from './Logo.jsx';

const MAIN = [
  { id: 'discover', label: 'Discover', icon: Home },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recent', label: 'Recently Added', icon: Clock },
  { id: 'sports', label: 'Sports Games', icon: Trophy },
  { id: 'all', label: 'All Games', icon: LayoutGrid },
];
const OTHERS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
];

export default function Sidebar({ view, onNavigate, onSignOut, open, onClose, favoriteCount }) {
  const item = ({ id, label, icon: Icon }) => (
    <li key={id}>
      <button type="button" className={`nav__item${view === id ? ' is-active' : ''}`} aria-current={view === id ? 'page' : undefined} onClick={() => onNavigate(id)}>
        <Icon aria-hidden="true" />
        <span>{label}</span>
        {id === 'favorites' && favoriteCount > 0 && <span className="nav__count">{favoriteCount}</span>}
      </button>
    </li>
  );

  return (
    <>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar${open ? ' is-open' : ''}`} aria-label="Main navigation">
        <div className="sidebar__top">
          <Logo />
          <button type="button" className="icon-btn sidebar__close" onClick={onClose} aria-label="Close menu">
            <X />
          </button>
        </div>
        <nav>
          <ul className="nav">{MAIN.map(item)}</ul>
          <p className="nav__heading">Others</p>
          <ul className="nav">
            {OTHERS.map(item)}
            <li>
              <button type="button" className="nav__item" onClick={onSignOut}>
                <LogOut aria-hidden="true" />
                <span>Sign Out</span>
              </button>
            </li>
          </ul>
        </nav>
        <div className="vip">
          <span className="vip__title"><Crown aria-hidden="true" /> PlayZone VIP</span>
          <p>Get exclusive access to new games.</p>
          <button type="button" className="btn btn--outline btn--block" disabled>Coming Soon</button>
        </div>
      </aside>
    </>
  );
}
