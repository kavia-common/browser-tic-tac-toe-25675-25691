import React, { useMemo, useState, useEffect } from 'react';
import './App.css';

/**
 * Ocean Professional Tic Tac Toe
 * - Modern UI with gradients, rounded corners, subtle shadows, and smooth transitions.
 * - Central 3x3 grid with controls and status below.
 * - Accent highlights on hover/active states.
 */

// Theme tokens (Ocean Professional)
const THEME = {
  name: 'Ocean Professional',
  colors: {
    primary: '#2563EB',   // blue
    secondary: '#F59E0B', // amber
    success: '#F59E0B',
    error: '#EF4444',
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textMuted: '#6B7280',
    border: 'rgba(17, 24, 39, 0.08)',
    shadow: 'rgba(0, 0, 0, 0.08)',
  },
};

// Helpers
function calculateWinner(squares) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6],         // diags
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { player: squares[a], line: [a,b,c] };
    }
  }
  return null;
}

function isDraw(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

// PUBLIC_INTERFACE
export function OceanBadge() {
  /** Displays theme name as a subtle badge. */
  return (
    <div className="badge" title={THEME.name}>
      <span className="badge-dot" />
      Ocean Professional
    </div>
  );
}

// PUBLIC_INTERFACE
export function Square({ value, onClick, highlight }) {
  /** Single square button with accent interactions. */
  return (
    <button
      className={`square ${highlight ? 'square-highlight' : ''}`}
      onClick={onClick}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
export function Board({ squares, onSquareClick, winningLine }) {
  /** 3x3 board rendering squares; highlights winning line if present. */
  const renderSquare = (i) => {
    const highlight = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={highlight}
      />
    );
  };

  return (
    <div className="board">
      <div className="row">{[0,1,2].map(renderSquare)}</div>
      <div className="row">{[3,4,5].map(renderSquare)}</div>
      <div className="row">{[6,7,8].map(renderSquare)}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Controls({ canUndo, onUndo, onReset }) {
  /** Control bar below the board. */
  return (
    <div className="controls">
      <button className="btn btn-ghost" onClick={onUndo} disabled={!canUndo}>
        ⟲ Undo
      </button>
      <button className="btn btn-primary" onClick={onReset}>
        Reset Board
      </button>
    </div>
  );
}

// PUBLIC_INTERFACE
export function Status({ xIsNext, winner, draw }) {
  /** Shows current status: whose turn or game result. */
  let text;
  let tone = 'info';
  if (winner) {
    text = `Winner: ${winner.player}`;
    tone = 'success';
  } else if (draw) {
    text = 'Draw game';
    tone = 'warning';
  } else {
    text = `Next: ${xIsNext ? 'X' : 'O'}`;
  }
  return (
    <div className={`status ${tone}`}>
      {text}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app: manages game state and renders UI. */
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [xIsNext, setXIsNext] = useState(true);
  const [theme, setTheme] = useState('light'); // light/dark toggle for subtle preference
  const current = history[history.length - 1];

  const winnerInfo = useMemo(() => calculateWinner(current), [current]);
  const draw = useMemo(() => isDraw(current), [current]);

  useEffect(() => {
    // Expose palette via CSS variables for styling in App.css
    const root = document.documentElement;
    root.style.setProperty('--ocn-primary', THEME.colors.primary);
    root.style.setProperty('--ocn-secondary', THEME.colors.secondary);
    root.style.setProperty('--ocn-success', THEME.colors.success);
    root.style.setProperty('--ocn-error', THEME.colors.error);
    root.style.setProperty('--ocn-bg', THEME.colors.background);
    root.style.setProperty('--ocn-surface', THEME.colors.surface);
    root.style.setProperty('--ocn-text', THEME.colors.text);
    root.style.setProperty('--ocn-text-muted', THEME.colors.textMuted);
    root.style.setProperty('--ocn-border', THEME.colors.border);
    root.style.setProperty('--ocn-shadow', THEME.colors.shadow);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleSquareClick = (i) => {
    if (winnerInfo || current[i]) return;
    const next = current.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setHistory([...history, next]);
    setXIsNext(!xIsNext);
  };

  const undo = () => {
    if (history.length <= 1) return;
    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setXIsNext((newHistory.length - 1) % 2 === 0);
  };

  const reset = () => {
    setHistory([Array(9).fill(null)]);
    setXIsNext(true);
  };

  const toggleTheme = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="app-shell">
      <div className="header">
        <div className="title-wrap">
          <h1 className="title">Tic Tac Toe</h1>
          <p className="subtitle">Classic game. Modern Ocean finish.</p>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          title="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      <main className="content">
        <div className="card">
          <Board
            squares={current}
            onSquareClick={handleSquareClick}
            winningLine={winnerInfo?.line}
          />
          <div className="divider" />
          <Status xIsNext={xIsNext} winner={winnerInfo} draw={draw} />
          <Controls
            canUndo={history.length > 1}
            onUndo={undo}
            onReset={reset}
          />
          <OceanBadge />
        </div>
      </main>

      <footer className="footer">
        <span>Built with the Ocean Professional theme</span>
      </footer>
    </div>
  );
}

export default App;
