import React, { useEffect, useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  ShieldAlert,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import type { StudentDataRequest, PredictionResponse } from '../types/api';
import { BENCHMARKS } from '../utils/constants';

interface ResultsCardProps {
  result: PredictionResponse;
  submittedData: StudentDataRequest;
  onNewAssessment: () => void;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({
  result,
  submittedData,
  onNewAssessment,
}) => {
  const [displayScore, setDisplayScore] = useState<number>(0);
  const targetScore = result.predicted_Mental_Health_Score;

  // Number count-up animation
  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // ms

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentVal = Number((easedProgress * targetScore).toFixed(2));
      setDisplayScore(currentVal);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setDisplayScore(targetScore);
      }
    };

    requestAnimationFrame(step);
  }, [targetScore]);

  // Position on verified 1 - 10 scale
  const percentageOnScale = Math.min(
    Math.max(((targetScore - BENCHMARKS.scaleMin) / (BENCHMARKS.scaleMax - BENCHMARKS.scaleMin)) * 100, 0),
    100
  );

  const diffFromMean = Number((targetScore - BENCHMARKS.meanScore).toFixed(2));

  return (
    <section id="results" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Glassmorphic Metric Card */}
        <div className="glass-panel-glow p-6 sm:p-10 rounded-3xl relative overflow-hidden border border-cyan-400/30">
          {/* Subtle background ambient glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

          {/* Top Badge */}
          <div className="flex items-center justify-between mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>FastAPI Model Inference Output</span>
            </div>
            <button
              onClick={onNewAssessment}
              className="text-xs font-medium text-slate-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Assessment</span>
            </button>
          </div>

          {/* Metric Center Display */}
          <div className="text-center my-6">
            <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold block mb-2">
              Predicted Mental Health Score
            </span>

            {/* Large Score with Count Animation */}
            <div className="inline-flex items-baseline justify-center gap-2">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black font-heading text-white tracking-tight drop-shadow-md">
                {displayScore.toFixed(2)}
              </span>
              <span className="text-xl sm:text-2xl text-slate-400 font-medium">
                / {BENCHMARKS.scaleMax.toFixed(1)}
              </span>
            </div>

            {/* Difference relative to dataset mean */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs sm:text-sm">
              {diffFromMean >= 0 ? (
                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>+{diffFromMean} above training baseline (avg: {BENCHMARKS.meanScore})</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 font-semibold">
                  <TrendingDown className="w-4 h-4" />
                  <span>{diffFromMean} below training baseline (avg: {BENCHMARKS.meanScore})</span>
                </span>
              )}
            </div>
          </div>

          {/* Scale Visual Gauge */}
          <div className="my-8 max-w-xl mx-auto">
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
              <span>Lower Resilience (1.0)</span>
              <span className="text-slate-300">Dataset Median: {BENCHMARKS.medianScore}</span>
              <span>Higher Wellbeing (10.0)</span>
            </div>

            {/* Gauge bar */}
            <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden relative p-0.5 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-rose-500 via-cyan-400 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${percentageOnScale}%` }}
              />
              {/* Dataset baseline marker */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-white/70"
                style={{
                  left: `${((BENCHMARKS.meanScore - BENCHMARKS.scaleMin) / (BENCHMARKS.scaleMax - BENCHMARKS.scaleMin)) * 100}%`,
                }}
                title={`Population Mean: ${BENCHMARKS.meanScore}`}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
              <span>Observed Min: {BENCHMARKS.minScore}</span>
              <span className="text-cyan-400 font-semibold">Current: {targetScore}</span>
              <span>Observed Max: {BENCHMARKS.maxScore}</span>
            </div>
          </div>

          {/* Key Input Influencers based on submitted data */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto my-6 pt-6 border-t border-white/10 text-left">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-[11px] text-slate-400">Sleep Duration</div>
              <div className="text-sm font-bold text-white mt-0.5">{submittedData.sleep_hours_per_night} hrs</div>
              <div className="text-[10px] text-slate-400">Avg: 6.6h</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-[11px] text-slate-400">Screen Time</div>
              <div className="text-sm font-bold text-white mt-0.5">{submittedData.avg_daily_usage_hours} hrs</div>
              <div className="text-[10px] text-slate-400">Avg: 5.1h</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-[11px] text-slate-400">Physical Activity</div>
              <div className="text-sm font-bold text-white mt-0.5">{submittedData.physical_activity_hours} hrs</div>
              <div className="text-[10px] text-slate-400">Avg: 1.8h</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5">
              <div className="text-[11px] text-slate-400">Stress Rating</div>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{submittedData.stress_level}</div>
              <div className="text-[10px] text-slate-400">{submittedData.purpose_of_use}</div>
            </div>
          </div>

          {/* Non-Clinical Ethical Disclaimer Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-slate-900/60 border border-white/10 flex items-start gap-3 text-left">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-white block mb-0.5">Educational Machine Learning Estimate — Not a Clinical Diagnosis</span>
              This predicted score is generated statistically by a Scikit-Learn Random Forest regression algorithm
              trained on 5,000 student survey responses. It models correlational relationships between digital media habits,
              rest cycles, and self-reported wellness indices. It is intended solely for personal awareness and research reflection,
              and should never replace professional medical, psychiatric, or healthcare consultation.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
