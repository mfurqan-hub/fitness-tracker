import React from 'react';

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card" style={{ height: '180px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="skeleton" style={{ height: '24px', width: '60%' }} />
          <div className="skeleton" style={{ height: '40px', width: '40%' }} />
          <div className="skeleton" style={{ height: '16px', width: '80%', marginTop: 'auto' }} />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i}>
                <div className="skeleton" style={{ height: '16px', width: '70%' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r}>
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c}>
                  <div className="skeleton" style={{ height: '16px', width: `${50 + (c * 15) % 40}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const ChartSkeleton = () => {
  return (
    <div className="card" style={{ height: '320px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="skeleton" style={{ height: '24px', width: '35%' }} />
      <div className="skeleton" style={{ height: '220px', width: '100%', borderRadius: '12px' }} />
    </div>
  );
};
