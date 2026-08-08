export default function MobileNavigation({ sections, activeSection, activeTab, onSection, onTab }) {
  const current = sections.find(s => s.id === activeSection);
  const children = current?.children || [];
  const hasChildren = children.length >= 2;

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <select
        className="mobile-nav-select"
        value={activeSection}
        onChange={e => onSection(e.target.value)}
        aria-label="Section"
      >
        {sections.map(s => (
          <option key={s.id} value={s.id}>{s.icon ? `${s.icon} ` : ''}{s.label}</option>
        ))}
      </select>
      {hasChildren && (
        <select
          className="mobile-nav-select"
          value={activeTab}
          onChange={e => onTab(e.target.value)}
          aria-label={`${current.label} sub-section`}
        >
          {children.map(c => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
      )}
    </nav>
  );
}
