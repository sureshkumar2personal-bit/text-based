export default function SectionNavigation({ section, activeTab, onSelect }) {
  const children = section?.children || [];
  if (children.length < 2) return null;
  return (
    <nav className="section-nav" aria-label={`${section.label} sub-navigation`}>
      {children.map(c => (
        <button
          key={c.id}
          type="button"
          className={`section-nav-item ${activeTab === c.id ? 'active' : ''}`}
          onClick={() => onSelect(c.id)}
          aria-current={activeTab === c.id ? 'page' : undefined}
        >
          {c.label}
        </button>
      ))}
    </nav>
  );
}
