import { useCallback, useEffect, useMemo, useState } from 'react';
import { Flame, Heart, SearchX, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import useFavorites from '../hooks/useFavorites.js';
import { CATEGORIES, GAMES } from '../data/games.js';
import Sidebar from '../components/Sidebar.jsx';
import TopBar from '../components/TopBar.jsx';
import Banner from '../components/Banner.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';
import GameCard from '../components/GameCard.jsx';
import GameModal from '../components/GameModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Toast from '../components/Toast.jsx';

const INITIAL_NOTIFICATIONS = [
  { id: 1, text: 'Space Strike just landed in PlayZone.', time: '2 hours ago', read: false },
  { id: 2, text: 'Football Fever is trending this week.', time: 'Yesterday', read: false },
  { id: 3, text: 'Welcome! Tap the heart on any game to save it.', time: '2 days ago', read: false },
];

const VIEW_TITLES = {
  discover: { title: 'Trending Games', sub: 'Popular games played by thousands' },
  favorites: { title: 'Your Favorites', sub: 'Games you have saved' },
  recent: { title: 'Recently Added', sub: 'The newest games in PlayZone' },
  sports: { title: 'Sports Games', sub: 'Cricket, football, basketball and more' },
  all: { title: 'All Games', sub: 'Browse the full catalogue' },
};

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const favorites = useFavorites();
  const [view, setView] = useState('discover');
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [toast, setToast] = useState('');
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(''), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
    return () => document.documentElement.classList.remove('reduce-motion');
  }, [reduceMotion]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navigate = useCallback((id) => {
    setView(id);
    setCategory('All');
    setMenuOpen(false);
    window.scrollTo?.({ top: 0 });
  }, []);

  const isGameView = ['discover', 'favorites', 'recent', 'sports', 'all'].includes(view);

  const games = useMemo(() => {
    let list = [...GAMES];
    if (view === 'discover') list = list.filter((g) => g.tag === 'TRENDING' || g.tag === 'NEW' || g.rating >= 4.4);
    if (view === 'favorites') list = list.filter((g) => favorites.ids.includes(g.id));
    if (view === 'recent') list.sort((a, b) => b.added - a.added);
    if (view === 'sports') list = list.filter((g) => g.category === 'Sports');
    if (category !== 'All') list = list.filter((g) => g.category === category);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    if (view === 'discover') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [view, category, query, favorites.ids]);

  const handleSignOut = () => {
    setSelected(null);
    signOut();
  };

  const handlePlay = (game) => setToast(`${game.name} is a demo listing. No real game launches here.`);

  const toggleFavorite = (id) => {
    const game = GAMES.find((g) => g.id === id);
    const wasFav = favorites.ids.includes(id);
    favorites.toggle(id);
    setToast(wasFav ? `Removed ${game.name} from favorites` : `Added ${game.name} to favorites`);
  };

  const clearFilters = () => {
    setQuery('');
    setCategory('All');
  };

  const head = VIEW_TITLES[view];
  const HeadIcon = view === 'favorites' ? Heart : view === 'recent' ? Sparkles : Flame;

  let empty = null;
  if (isGameView && games.length === 0) {
    if (view === 'favorites' && favorites.ids.length === 0 && !query && category === 'All') {
      empty = (
        <EmptyState icon={Heart} title="No favorites yet" message="Tap the heart on any game to save it here." actionLabel="Discover games" onAction={() => navigate('discover')} />
      );
    } else {
      empty = (
        <EmptyState icon={SearchX} title="No games found" message="Try a different search or category." actionLabel="Clear filters" onAction={clearFilters} />
      );
    }
  }

  return (
    <div className="app">
      <Sidebar view={view} onNavigate={navigate} onSignOut={handleSignOut} open={menuOpen} onClose={() => setMenuOpen(false)} favoriteCount={favorites.ids.length} />

      <div className="main">
        <TopBar
          query={query}
          onQueryChange={(v) => { setQuery(v); if (!isGameView) setView('all'); }}
          user={user}
          notifications={notifications}
          onMarkAllRead={() => setNotifications((n) => n.map((x) => ({ ...x, read: true })))}
          onOpenMenu={() => setMenuOpen(true)}
          onNavigate={navigate}
          onSignOut={handleSignOut}
        />

        <main className="content" id="content">
          {view === 'discover' && <Banner onExplore={() => navigate('all')} />}

          {isGameView && (
            <>
              <CategoryFilter categories={CATEGORIES} active={category} onChange={setCategory} />
              <div className="section-head">
                <div>
                  <h2><HeadIcon aria-hidden="true" /> {head.title}</h2>
                  <p>{head.sub}</p>
                </div>
                {view === 'discover' && (
                  <button type="button" className="link-btn" onClick={() => navigate('all')}>View all</button>
                )}
              </div>
              {empty || (
                <div className="grid">
                  {games.map((g) => (
                    <GameCard key={g.id} game={g} isFavorite={favorites.isFavorite(g.id)} onToggleFavorite={toggleFavorite} onOpen={setSelected} />
                  ))}
                </div>
              )}
            </>
          )}

          {view === 'profile' && (
            <section className="panel">
              <h2>Profile</h2>
              <div className="panel__profile">
                <span className="avatar avatar--lg" aria-hidden="true">{user.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{user.name}</strong>
                  <p>{user.email}</p>
                  <p>{user.role}{user.demo ? ' (guest session)' : ''}</p>
                </div>
              </div>
              <ul className="stats">
                <li><strong>{favorites.ids.length}</strong><span>Favorites</span></li>
                <li><strong>{GAMES.length}</strong><span>Games in catalogue</span></li>
              </ul>
              <button type="button" className="btn btn--outline" onClick={handleSignOut}>Sign out</button>
            </section>
          )}

          {view === 'settings' && (
            <section className="panel">
              <h2>Settings</h2>
              <label className="switch">
                <input type="checkbox" checked={reduceMotion} onChange={(e) => setReduceMotion(e.target.checked)} />
                <span>Reduce animations</span>
              </label>
              <button
                type="button"
                className="btn btn--outline"
                onClick={() => { favorites.ids.forEach((id) => favorites.toggle(id)); setToast('Favorites cleared'); }}
                disabled={favorites.ids.length === 0}
              >
                Clear all favorites
              </button>
              <p className="panel__hint">Settings apply to this session only.</p>
            </section>
          )}

          {view === 'help' && (
            <section className="panel">
              <h2>Help</h2>
              <details open><summary>What is PlayZone?</summary><p>A demo directory for browsing game apps. Nothing here is a real store or service.</p></details>
              <details><summary>Is real money involved?</summary><p>No. There are no deposits, withdrawals, payments or betting anywhere in this project.</p></details>
              <details><summary>How is sign-in handled?</summary><p>Sign-in is simulated in the browser. No password is saved, and a real product would need a secure backend.</p></details>
              <details><summary>Where are my favorites saved?</summary><p>Only game ids are stored in this browser's local storage.</p></details>
            </section>
          )}
        </main>
      </div>

      {selected && (
        <GameModal
          game={selected}
          isFavorite={favorites.isFavorite(selected.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
          onPlay={handlePlay}
        />
      )}
      <Toast message={toast} />
    </div>
  );
}
