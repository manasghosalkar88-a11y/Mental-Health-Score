import React from 'react';
import {
  Brain,
  Database,
  Lock,
  Cpu,
  ExternalLink,
} from 'lucide-react';
import { DOCS_URL } from '../utils/constants';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 sm:py-20 scroll-mt-20 border-t border-white/5">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Brain className="w-3.5 h-3.5" />
            <span>Project Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-3">
            About MindScope AI & ML Pipeline
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base leading-relaxed">
            MindScope AI is an educational machine learning platform designed to model and explore empirical
            connections between daily digital habits, sleep architecture, physical exercise, and mental wellness scores.
          </p>
        </div>

        {/* 2-Column Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Column 1: Model & Data Engineering */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Random Forest Regression Pipeline</h3>
                  <span className="text-xs text-slate-400">Scikit-Learn + FastAPI Backend</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  The model utilizes an ensemble <strong>RandomForestRegressor</strong> (hyperparameter-tuned with 300 estimators, max depth 15)
                  preceded by a robust <code>ColumnTransformer</code> pipeline:
                </p>
                <ul className="space-y-2 pl-3 border-l-2 border-violet-500/30">
                  <li>
                    <strong className="text-white">Skewed Numerics:</strong> <code>log1p</code> transform followed by <code>StandardScaler</code> on Study Hours.
                  </li>
                  <li>
                    <strong className="text-white">Numeric Features:</strong> <code>StandardScaler</code> on Age, Usage Hours, Daily Unlocks, Physical Activity, and Sleep.
                  </li>
                  <li>
                    <strong className="text-white">Ordinal Categoricals:</strong> Ordered encoding for Stress Level (Low → Medium → High → Very High).
                  </li>
                  <li>
                    <strong className="text-white">Nominal Features:</strong> One-Hot Encoding with unknown value handling for Gender, Academic Level, Platform, Purpose, and Country.
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-[11px] text-slate-400">Test Accuracy (R²)</div>
                <div className="text-base font-bold text-violet-300 mt-0.5">~0.88 – 0.89</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-900/40 border border-white/5">
                <div className="text-[11px] text-slate-400">Mean Abs Error (MAE)</div>
                <div className="text-base font-bold text-cyan-300 mt-0.5">~0.33 – 0.35</div>
              </div>
            </div>
          </div>

          {/* Column 2: Data & Training Context */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Dataset & Empirical Scope</h3>
                  <span className="text-xs text-slate-400">5,000 Multi-National Student Survey Records</span>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
                <p>
                  Trained on <strong>Student Social Media And Mental Health Impact.csv</strong>, representing 5,000 student participants across various academic tiers.
                </p>
                <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/5 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Target Metric:</span>
                    <span className="font-semibold text-white">Mental Health Score (1.0 to 10.0 scale)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Observed Range:</span>
                    <span className="font-semibold text-cyan-300">Min 3.6 — Max 9.4</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Dataset Baseline Mean:</span>
                    <span className="font-semibold text-white">6.23 (Median 6.10, Std 1.28)</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Key observed correlations: Higher daily social media screen time and extreme stress strongly associate with lower scores,
                  whereas consistent nightly sleep (7-8+ hours) and regular exercise show strong positive associations.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-slate-400">Interactive API documentation</span>
              <a
                href={DOCS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Open Swagger UI</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Privacy Notice Banner */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-emerald-500/20 bg-emerald-950/10 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-white font-heading">Zero-Tracking Local Privacy Guarantee</h4>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Strict Confidentiality
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Your privacy is paramount. Assessment data is sent exclusively to your local FastAPI backend server at{' '}
                <code className="text-emerald-300 bg-slate-900/80 px-1.5 py-0.5 rounded">http://127.0.0.1:2200</code> for real-time mathematical inference.
                This application <strong>does not persist</strong> assessment responses in any database, sets no tracking cookies,
                and never communicates with third-party analytics or ad trackers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
