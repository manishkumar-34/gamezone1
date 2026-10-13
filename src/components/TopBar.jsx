import { useEffect, useRef, useState } from 'react';
import { Bell, ChevronDown, Menu, Search, X } from 'lucide-react';

export default function TopBar({ query, onQueryChange, user, notifications, onMarkAllRead, onOpenMenu, onNavigate, onSignOut }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const wrapRef = useRef(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setNotifOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <header className="topbar" ref={wrapRef}>
      <button type="button" className="icon-btn topbar__menu" onClick={onOpenMenu} aria-label="Open menu">
        <Menu />
      </button>

      <div className="search">
        <label htmlFor="game-search" className="sr-only">Search games</label>
        <Search aria-hidden="true" className="search__icon" />
        <input id="game-search" type="search" placeholder="Search games..." value={query} onChange={(e) => onQueryChange(e.target.value)} autoComplete="off" />
        {query && (
          <button type="button" className="search__clear" onClick={() => onQueryChange('')} aria-label="Clear search">
            <X />
          </button>
        )}
      </div>

      <div className="topbar__right">
        <div className="popwrap">
          <button
            type="button"
            className="icon-btn"
            onClick={() => { setNotifOpen((o) => !o); setProfileOpen(false); }}
            aria-expanded={notifOpen}
            aria-haspopup="true"
            aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
          >
            <Bell />
            {unread > 0 && <span className="dot-count">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="popover" role="region" aria-label="Notifications">
              <div className="popover__head">
                <strong>Notifications</strong>
                <button type="button" className="link-btn" onClick={onMarkAllRead} disabled={!unread}>Mark all read</button>
              </div>
              <ul className="notif">
                {notifications.map((n) => (
                  <li key={n.id} className={n.read ? '' : 'is-unread'}>
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="popwrap">
          <button
            type="button"
            className="profile-btn"
            onClick={() => { setProfileOpen((o) => !o); setNotifOpen(false); }}
            aria-expanded={profileOpen}
            aria-haspopup="true"
            aria-label="Account menu"
          >
            <span className="avatar" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
            <span className="profile-btn__text">
              <strong>{user.name}</strong>
              <small>{user.role}</small>
            </span>
            <ChevronDown aria-hidden="true" className="profile-btn__chev" />
          </button>
          {profileOpen && (
            <div className="popover popover--menu">
              <button type="button" onClick={() => { setProfileOpen(false); onNavigate('profile'); }}>Profile</button>
              <button type="button" onClick={() => { setProfileOpen(false); onNavigate('settings'); }}>Settings</button>
              <button type="button" onClick={onSignOut}>Sign out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
