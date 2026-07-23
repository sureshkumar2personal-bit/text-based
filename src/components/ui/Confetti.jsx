import { useEffect, useState } from 'react';

const COLORS = ['#5c3b8b', '#9b6fd4', '#db9a40', '#27ae60', '#60a5fa', '#c084fc', '#f87171', '#34d399', '#f9a826', '#e879f9'];

function randomBetween(a, b) { return Math.random() * (b - a) + a; }

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) { setPieces([]); return; }
    const newPieces = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: randomBetween(0, 100),
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: randomBetween(6, 12),
      delay: randomBetween(0, 0.8),
      rotation: randomBetween(0, 360),
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }));
    setPieces(newPieces);
    const timer = setTimeout(() => setPieces([]), 3500);
    return () => clearTimeout(timer);
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : '2px',
            animationDelay: `${p.delay}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}
