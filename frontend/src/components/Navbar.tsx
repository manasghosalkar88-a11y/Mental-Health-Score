import React, { useState } from 'react';
import { Activity, RefreshCw, Menu, X, ExternalLink } from 'lucide-react';
import type { ApiConnectionState } from '../types/api';
import { DOCS_URL } from '../utils/constants';

interface NavbarProps {
  apiStatus: ApiConnectionState;
  onRefreshHealth: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiStatus,
  onRefreshHealth,
  activeSection,
  setActiveSection,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'assessment', label: 'Assessment' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'about', label: 'About & Model' },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleNavClick('hero')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 via-sky-500/30 to-violet-500/20 border border-cyan-400/30 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/60 transition-all duration-300">
            <Activity className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-heading">
                MindScope
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-semibold tracking-wider uppercase">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium tracking-wide">
              Mental Wellness Analytics
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-cyan-300 hover:bg-white/5 transition-colors"
            title="FastAPI Swagger documentation"
          >
            <span>Swagger API</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </nav>

        {/* API Status Badge & Action */}
        <div className="hidden sm:flex items-center gap-3">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300 ${
              apiStatus === 'connected'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : apiStatus === 'checking'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}
          >
            {apiStatus === 'connected' ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden lg:inline">Backend</span> Connected
              </>
            ) : apiStatus === 'checking' ? (
              <>
                <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                <span>Checking API...</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Backend Offline</span>
              </>
            )}

            <button
              onClick={onRefreshHealth}
              disabled={apiStatus === 'checking'}
              className="ml-1 p-0.5 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
              title="Ping http://127.0.0.1:2200"
              aria-label="Refresh backend connection"
            >
              <RefreshCw className={`w-3 h-3 ${apiStatus === 'checking' ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {/* Mobile status indicator dot */}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              apiStatus === 'connected'
                ? 'bg-emerald-400'
                : apiStatus === 'checking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-rose-500'
            }`}
            title={`Backend: ${apiStatus}`}
          />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 px-4 pt-2 pb-5 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-cyan-300 hover:bg-white/5 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-300 hover:bg-white/5"
          >
            <span>FastAPI Swagger Docs</span>
            <ExternalLink className="w-4 h-4 opacity-70" />
          </a>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between px-4 text-xs">
            <span className="text-slate-400">Backend API (Port 2200)</span>
            <span
              className={`font-semibold ${
                apiStatus === 'connected'
                  ? 'text-emerald-400'
                  : apiStatus === 'checking'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {apiStatus.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </header>
  );
};
