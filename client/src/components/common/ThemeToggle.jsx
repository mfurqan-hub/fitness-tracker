import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-secondary btn-icon ${className}`}
      title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun size={18} className="text-amber-400" color="#f59e0b" />
      ) : (
        <Moon size={18} className="text-indigo-400" color="#8b5cf6" />
      )}
    </button>
  );
};

export default ThemeToggle;
