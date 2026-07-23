export default function Skeleton({ width, height, borderRadius, style }) {
  return (
    <div
      className="skeleton"
      style={{ width: width || '100%', height: height || '16px', borderRadius: borderRadius || '8px', ...style }}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card" style={{ pointerEvents: 'none' }}>
      <Skeleton width="60%" height="20px" />
      <div style={{ marginTop: '0.6rem' }}>
        <Skeleton height="12px" />
      </div>
      <div style={{ marginTop: '0.3rem' }}>
        <Skeleton width="80%" height="12px" />
      </div>
      <div style={{ marginTop: '0.8rem', display: 'flex', gap: '0.3rem' }}>
        <Skeleton width="60px" height="22px" borderRadius="20px" />
        <Skeleton width="70px" height="22px" borderRadius="20px" />
      </div>
      <div style={{ marginTop: '0.6rem' }}>
        <Skeleton height="8px" borderRadius="4px" />
      </div>
    </div>
  );
}
