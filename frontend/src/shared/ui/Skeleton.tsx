'use client';

/** Анимированные плейсхолдеры вместо текстовых "Загрузка..." */
export function Skeleton({ h = 16, w = '100%', radius = 6, style }: { h?: number; w?: number | string; radius?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        height: h, width: typeof w === 'number' ? `${w}px` : w, borderRadius: radius,
        background: 'linear-gradient(90deg,#E8ECF0,#D0D5DD,#E8ECF0)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function SkeletonRow({ columns = 6 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #F0F3F6' }}>
          <Skeleton h={14} w={`${60 + ((i * 11) % 30)}%`} />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 6, columns = 6 }: { rows?: number; columns?: number }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E8ECF0', borderRadius: '12px', overflow: 'hidden' }}>
      <table className="admin-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}><Skeleton h={10} w={50 + (i * 7) % 25} /></th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonRow key={i} columns={columns} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
