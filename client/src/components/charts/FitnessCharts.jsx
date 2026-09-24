import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const LineChartWidget = ({ data, title, height = 260, yAxisLabel = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
        usePointStyle: true
      }
    },
    scales: {
      x: {
        grid: {
          color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: isDark ? '#94a3b8' : '#64748b'
        },
        grid: {
          color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Line options={options} data={data} />
    </div>
  );
};

export const BarChartWidget = ({ data, height = 260, yAxisLabel = '' }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        borderWidth: 1,
        padding: 10
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      },
      y: {
        title: {
          display: !!yAxisLabel,
          text: yAxisLabel,
          color: isDark ? '#94a3b8' : '#64748b'
        },
        grid: {
          color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
        },
        ticks: {
          color: isDark ? '#94a3b8' : '#64748b',
          font: { size: 11 }
        }
      }
    }
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export const DoughnutChartWidget = ({ data, height = 220 }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: isDark ? '#f8fafc' : '#0f172a',
          font: { size: 12, weight: 600 },
          padding: 14,
          usePointStyle: true
        }
      },
      tooltip: {
        backgroundColor: isDark ? '#0f172a' : '#ffffff',
        titleColor: isDark ? '#f8fafc' : '#0f172a',
        bodyColor: isDark ? '#94a3b8' : '#475569',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
        borderWidth: 1
      }
    },
    cutout: '68%'
  };

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
      <Doughnut options={options} data={data} />
    </div>
  );
};
