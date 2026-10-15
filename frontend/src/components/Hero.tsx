import React from 'react';
import { ArrowRight, BookOpen, Brain, Sparkles, Shield, Cpu } from 'lucide-react';
import { DOCS_URL } from '../utils/constants';

interface HeroProps {
  onStartAssessment: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartAssessment }) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-28 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Subtle top pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-semibold text-cyan-300 tracking-wide uppercase">
            Machine Learning Inference Engine
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-300 font-medium">FastAPI & Random Forest</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white font-heading leading-[1.1] mb-6">
          Understand Your <br />
          <span className="text-gradient-cyan">Digital Wellbeing</span>
        </h1>

        {/* Supporting Copy */}
        <p className="max-w-3xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed mb-10">
          Explore how digital habits, sleep, physical activity, and stress relate to your
          predicted mental health score. Powered by an empirical machine learning model trained on student lifestyle dynamics.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 mb-14">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-xl font-medium text-base text-slate-200 glass-panel-subtle hover:text-white hover:border-white/20 transition-all duration-300 flex items-center justify-center gap-2 group"
          >
            <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>View API Documentation</span>
          </a>
        </div>

        {/* Highlight Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto pt-4 border-t border-white/5">
          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">12 Input Factors</div>
              <div className="text-[11px] text-slate-400">Holistic lifestyle balance</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Random Forest</div>
              <div className="text-[11px] text-slate-400">R² ~ 0.88 test accuracy</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">1.0 – 10.0 Scale</div>
              <div className="text-[11px] text-slate-400">Continuous ML index</div>
            </div>
          </div>

          <div className="glass-panel p-3.5 rounded-xl flex items-center gap-3 text-left">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">Private & Local</div>
              <div className="text-[11px] text-slate-400">Runs on 127.0.0.1:2200</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
