import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import {
  Clock,
  PieChart as PieIcon,
  BarChart3,
} from 'lucide-react';
import type { StudentDataRequest, PredictionResponse } from '../types/api';

interface DashboardAnalyticsProps {
  submittedData: StudentDataRequest | null;
  predictionResult: PredictionResponse | null;
  onNavigateToAssessment: () => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({
  submittedData,
  predictionResult,
  onNavigateToAssessment,
}) => {
  if (!submittedData || !predictionResult) {
    return (
      <section id="dashboard" className="py-12 sm:py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center border border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center mb-5">
              <PieIcon className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white font-heading mb-2">No Assessment Data Yet</h3>
            <p className="max-w-md mx-auto text-sm text-slate-400 mb-6 leading-relaxed">
              Complete your lifestyle and digital habits assessment to unlock your personalized 24-hour time breakdown
              and wellness factor analysis.
            </p>
            <button
              onClick={onNavigateToAssessment}
              className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-300 hover:from-cyan-300 hover:to-sky-200 transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              Start Your Assessment
            </button>
          </div>
        </div>
      </section>
    );
  }

  // Calculate 24-Hour Day Allocation based solely on user inputs
  const sleepHours = submittedData.sleep_hours_per_night;
  const studyHours = submittedData.study_hours;
  const socialHours = submittedData.avg_daily_usage_hours;
  const activityHours = submittedData.physical_activity_hours;
  const allocated = sleepHours + studyHours + socialHours + activityHours;
  const remainingHours = Math.max(Number((24 - allocated).toFixed(1)), 0);

  const timeBreakdownData = [
    { name: 'Sleep & Rest', hours: sleepHours, color: '#38bdf8' },
    { name: 'Study & Academics', hours: studyHours, color: '#818cf8' },
    { name: 'Social Media', hours: socialHours, color: '#f43f5e' },
    { name: 'Physical Exercise', hours: activityHours, color: '#10b981' },
    { name: 'Other Daily Routines', hours: remainingHours, color: '#475569' },
  ].filter((item) => item.hours > 0);

  // Lifestyle comparison metrics
  const factorComparisons = [
    {
      factor: 'Daily Screen Time',
      userValue: `${submittedData.avg_daily_usage_hours}h`,
      detail: `${submittedData.daily_unlocks} unlocks/day on ${submittedData.most_used_platform}`,
      status: submittedData.avg_daily_usage_hours > 6 ? 'High Screen Volume' : 'Moderate Screen Volume',
      color: submittedData.avg_daily_usage_hours > 6 ? 'text-amber-400' : 'text-cyan-400',
    },
    {
      factor: 'Rest & Recovery',
      userValue: `${submittedData.sleep_hours_per_night}h`,
      detail: submittedData.sleep_hours_per_night >= 7 ? 'Adequate nightly rest' : 'Sub-optimal sleep target',
      status: submittedData.sleep_hours_per_night >= 7 ? 'Healthy Rest' : 'Rest Deficit',
      color: submittedData.sleep_hours_per_night >= 7 ? 'text-emerald-400' : 'text-rose-400',
    },
    {
      factor: 'Physical Movement',
      userValue: `${submittedData.physical_activity_hours}h`,
      detail: `${submittedData.physical_activity_hours} daily exercise hours`,
      status: submittedData.physical_activity_hours >= 1.5 ? 'Active Lifestyle' : 'Low Activity',
      color: submittedData.physical_activity_hours >= 1.5 ? 'text-emerald-400' : 'text-slate-400',
    },
    {
      factor: 'Stress & Academics',
      userValue: `${submittedData.stress_level}`,
      detail: `${submittedData.study_hours}h study dedicated for ${submittedData.purpose_of_use}`,
      status: `Perceived ${submittedData.stress_level} Stress`,
      color:
        submittedData.stress_level === 'Low'
          ? 'text-emerald-400'
          : submittedData.stress_level === 'Medium'
          ? 'text-cyan-400'
          : 'text-rose-400',
    },
  ];

  return (
    <section id="dashboard" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Submitted Data Analytics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-2">
            Personal Lifestyle Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm">
            Breakdown and analysis derived directly from your submitted assessment inputs.
          </p>
        </div>

        {/* 4 Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {factorComparisons.map((item, idx) => (
            <div key={idx} className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-xs text-slate-400 font-medium block mb-1">{item.factor}</span>
                <div className="text-2xl font-extrabold text-white font-heading">{item.userValue}</div>
                <div className="text-xs text-slate-400 mt-1 leading-snug">{item.detail}</div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5">
                <span className={`text-[11px] font-semibold ${item.color}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 24-Hour Time Allocation Donut Chart */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white font-heading">24-Hour Daily Time Allocation</h4>
              </div>
              <span className="text-xs text-slate-400">Total: 24 hrs</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeBreakdownData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="hours"
                  >
                    {timeBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(5,8,17,0.8)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(13, 21, 39, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} hrs`, 'Time Allocated']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-white/5 text-xs">
              {timeBreakdownData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate">
                    {item.name}: <strong className="text-white">{item.hours}h</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quantitative Hours Bar Chart */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-5 h-5 text-sky-400" />
                <h4 className="text-base font-bold text-white font-heading">Daily Hours by Activity</h4>
              </div>
              <span className="text-xs text-slate-400">Individual metrics</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Sleep', hours: sleepHours, fill: '#38bdf8' },
                    { name: 'Study', hours: studyHours, fill: '#818cf8' },
                    { name: 'Social', hours: socialHours, fill: '#f43f5e' },
                    { name: 'Exercise', hours: activityHours, fill: '#10b981' },
                  ]}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 24]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(13, 21, 39, 0.95)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '0.75rem',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [`${val} hours`, 'Duration']}
                  />
                  <Bar dataKey="hours" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="pt-4 border-t border-white/5 text-xs text-slate-400 flex items-center justify-between">
              <span>Primary Platform: <strong className="text-white">{submittedData.most_used_platform}</strong></span>
              <span>Daily Device Unlocks: <strong className="text-cyan-400">{submittedData.daily_unlocks}</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
