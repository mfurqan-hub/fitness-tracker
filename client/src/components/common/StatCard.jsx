import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({
  title,
  value,
  unit = '',
  icon: Icon,
  color = 'emerald',
  trend = null,
  trendLabel = '',
  subtext = '',
  onClick = null
}) => {
  const colorMap = {
    emerald: {
      bg: 'rgba(16, 185, 129, 0.12)',
      text: '#10b981',
      border: 'rgba(16, 185, 129, 0.25)'
    },
    cyan: {
      bg: 'rgba(6, 182, 212, 0.12)',
      text: '#06b6d4',
      border: 'rgba(6, 182, 212, 0.25)'
    },
    blue: {
      bg: 'rgba(59, 130, 246, 0.12)',
      text: '#3b82f6',
      border: 'rgba(59, 130, 246, 0.25)'
    },
    purple: {
      bg: 'rgba(139, 92, 246, 0.12)',
      text: '#a78bfa',
      border: 'rgba(139, 92, 246, 0.25)'
    },
    amber: {
      bg: 'rgba(245, 158, 11, 0.12)',
      text: '#fbbf24',
      border: 'rgba(245, 158, 11, 0.25)'
    },
    rose: {
      bg: 'rgba(244, 63, 94, 0.12)',
      text: '#fb7185',
      border: 'rgba(244, 63, 94, 0.25)'
    }
  };

  const scheme = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`stat-widget ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
    >
      <div
        className="stat-icon-wrapper"
        style={{
          background: scheme.bg,
          color: scheme.text,
          border: `1px solid ${scheme.border}`
        }}
      >
        {Icon && <Icon size={24} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="stat-label">{title}</div>
        <div className="stat-value" style={{ marginTop: '0.2rem' }}>
          {value}{' '}
          {unit && (
            <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {unit}
            </span>
          )}
        </div>
        {trend !== null && (
          <div
            className="stat-trend"
            style={{ color: trend >= 0 ? '#10b981' : '#f43f5e' }}
          >
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{Math.abs(trend)}% {trendLabel}</span>
          </div>
        )}
        {subtext && !trend && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {subtext}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
