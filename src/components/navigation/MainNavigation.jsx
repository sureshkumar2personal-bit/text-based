export default function MainNavigation({ sections, activeSection, onSelect }) {
  return (
    <nav className="main-nav" aria-label="Primary navigation">
      {sections.map(s => (
        <button
          key={s.id}
          type="button"
          className={`main-nav-item ${activeSection === s.id ? 'active' : ''} ${s.id === 'emergency' ? 'main-nav-emergency' : ''}`}
          onClick={() => onSelect(s.id)}
          aria-current={activeSection === s.id ? 'page' : undefined}
        >
          {s.icon && <span className="main-nav-icon" aria-hidden="true">{s.icon}</span>}
          <span className="main-nav-label">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}
