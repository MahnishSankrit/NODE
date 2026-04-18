import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import User from '../cards/User';

function Topbar() {
  const navigate = useNavigate();
  const [showUserCard, setShowUserCard] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/75 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="inline-flex items-center gap-3">
          {/* UI refresh: polished brand mark without affecting navigation */}
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg text-white shadow-lg shadow-slate-900/15">✓</span>
          <div>
            <span className="block text-sm font-semibold uppercase tracking-[0.22em] text-blue-600">Workspace</span>
            <span className="block text-lg font-semibold tracking-tight text-slate-950">Todo + Blog</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex md:gap-3">
          <Link to="/todo" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Todo</Link>
          <Link to="/posts" className="rounded-2xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Posts</Link>
          <button
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:bg-slate-50"
            onClick={() => setShowUserCard((v) => !v)}
          >
            Profile
          </button>
          <button
            className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
            onClick={handleLogout}
          >
            Logout
          </button>
        </nav>

        {/* UI refresh: mobile actions remain functionally identical with cleaner affordances */}
        <div className="inline-flex items-center gap-2 sm:hidden">
          <Link to="/todo" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">Todo</Link>
          <Link to="/posts" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">Posts</Link>
          <button onClick={() => setShowUserCard((v) => !v)} className="rounded-xl bg-slate-950 px-3 py-2 text-sm text-white">Me</button>
        </div>
      </div>

      {/* UI refresh: keep the same overlay behavior with refined positioning */}
      {showUserCard && (
        <div className="absolute right-4 top-20 sm:right-6 lg:right-8">
          <User onLogout={handleLogout} close={() => setShowUserCard(false)} />
        </div>
      )}
    </header>
  );
}

export default Topbar;
