export default function Avatar({ name, size, style }) {
  const initial = (name || '?').charAt(0).toUpperCase();
  const colors = [
    '#5c3b8b', '#9b6fd4', '#db9a40', '#27ae60', '#60a5fa',
    '#c084fc', '#f87171', '#34d399', '#f9a826', '#e879f9'
  ];
  const hash = (name || '').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = colors[hash % colors.length];
  return (
    <div
      className={`avatar${size === 'sm' ? ' avatar-sm' : ''}${size === 'lg' ? ' avatar-lg' : ''}`}
      style={{ background: `linear-gradient(135deg, ${bg}, ${colors[(hash + 1) % colors.length]})`, ...style }}
    >
      {initial}
    </div>
  );
}
