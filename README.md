# PlayZone - Gaming Apps Directory

A modern purple-and-black gaming directory built with **React 18 + Vite** and **lucide-react**.

> **Frontend demo only.** There is no real-money gambling, betting, deposits, withdrawals, payments, or real authentication. Sign-in is simulated in the browser.

## Run

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the production build
```

## Demo sign-in

- Email: `manish@gmail.com`
- Password: `PlayZone@123`
- Or click **Explore Demo** to enter as a guest.

## What's implemented

- Login with validation, show/hide password, loading state, and clear error messages
- Simulated auth (`src/context/AuthContext.jsx`): credentials are checked against a hard-coded demo account. The password is **never stored**; only name/email are kept in `sessionStorage` for the session.
- Dashboard: sidebar, top bar with live search, notifications panel (mark all read), profile menu, welcome banner
- 14 game cards with generated artwork (no external images), ratings, categories, NEW / HOT labels
- Category filters, search, favorites (ids only in `localStorage`), Recently Added, Sports Games, All Games
- Game detail modal with focus trap, Esc to close, and focus restore
- Empty states, toasts, Profile / Settings / Help views, responsive slide-in mobile menu
- Accessible labels, keyboard focus styles, reduced-motion support

## Deploy to Vercel

Push to GitHub, import the repo in Vercel (framework preset: Vite). `vercel.json` is included.

## Project structure

```
src/
  components/  Banner, CategoryFilter, EmptyState, GameCard, GameIcon, GameModal, Logo, Sidebar, Toast, TopBar
  pages/       Login, Dashboard
  context/     AuthContext (simulated auth)
  hooks/       useFavorites
  data/        games.js (demo catalogue)
  styles/      index.css
```

## Notes

- Game titles are fictional demo listings. "Play now" shows a notice; no real game launches.
- To add real authentication later, replace `signIn` in `AuthContext.jsx` with calls to a secure backend (HTTP-only cookies / OAuth).
