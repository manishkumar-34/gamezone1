export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Filter games by category">
      {categories.map((c) => (
        <button key={c} type="button" className={`chip${active === c ? ' is-active' : ''}`} aria-pressed={active === c} onClick={() => onChange(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}
