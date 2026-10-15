import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Smartphone,
  HeartPulse,
  Sparkles,
  RotateCcw,
  Send,
  AlertCircle,
  Sliders,
} from 'lucide-react';
import type {
  StudentDataRequest,
  Gender,
  AcademicLevel,
  PurposeOfUse,
  StressLevel,
  FormValidationErrors,
} from '../types/api';
import {
  COUNTRIES,
  ACADEMIC_LEVELS,
  SOCIAL_PLATFORMS,
  PURPOSES_OF_USE,
  STRESS_LEVELS,
  SAMPLE_PROFILES,
} from '../utils/constants';

interface AssessmentFormProps {
  formData: StudentDataRequest;
  onChange: (newData: StudentDataRequest) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClear: () => void;
  isLoading: boolean;
  serverError: string | null;
}

export const AssessmentForm: React.FC<AssessmentFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onClear,
  isLoading,
  serverError,
}) => {
  const [errors, setErrors] = useState<FormValidationErrors>({});
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Validate fields in real-time or on blur
  const validateForm = (data: StudentDataRequest): boolean => {
    const errs: FormValidationErrors = {};

    if (data.age < 10 || data.age > 100 || isNaN(data.age)) {
      errs.age = 'Age must be an integer between 10 and 100';
    }
    if (!data.country || data.country.trim() === '') {
      errs.country = 'Country is required';
    }
    if (data.avg_daily_usage_hours < 0 || data.avg_daily_usage_hours > 24 || isNaN(data.avg_daily_usage_hours)) {
      errs.avg_daily_usage_hours = 'Daily usage must be between 0 and 24 hours';
    }
    if (data.daily_unlocks < 0 || isNaN(data.daily_unlocks) || !Number.isInteger(data.daily_unlocks)) {
      errs.daily_unlocks = 'Unlocks must be a non-negative integer';
    }
    if (data.study_hours < 0 || data.study_hours > 24 || isNaN(data.study_hours)) {
      errs.study_hours = 'Study hours must be between 0 and 24 hours';
    }
    if (data.physical_activity_hours < 0 || data.physical_activity_hours > 24 || isNaN(data.physical_activity_hours)) {
      errs.physical_activity_hours = 'Physical activity must be between 0 and 24 hours';
    }
    if (data.sleep_hours_per_night < 0 || data.sleep_hours_per_night > 24 || isNaN(data.sleep_hours_per_night)) {
      errs.sleep_hours_per_night = 'Sleep must be between 0 and 24 hours';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFieldChange = <K extends keyof StudentDataRequest>(
    key: K,
    value: StudentDataRequest[K]
  ) => {
    const updated = { ...formData, [key]: value };
    onChange(updated);
    validateForm(updated);
    setActivePreset(null);
  };

  const applyPreset = (preset: (typeof SAMPLE_PROFILES)[0]) => {
    onChange({ ...preset.data });
    setActivePreset(preset.label);
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(formData)) {
      onSubmit(e);
    }
  };

  const isFormValid = Object.keys(errors).length === 0;

  return (
    <section id="assessment" className="py-12 sm:py-16 scroll-mt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Assessment</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight mb-3">
            Wellness & Digital Habit Assessment
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 text-sm sm:text-base">
            Input your daily screen habits, academic routines, and sleep hours. All 12 parameters
            are fed into the Random Forest model for on-the-fly score inference.
          </p>
        </div>

        {/* Quick Demo Profile Presets */}
        <div className="glass-panel p-4 rounded-2xl mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Fill Demo Profiles:
            </span>
            <span className="text-[11px] text-slate-400">Click to instantly populate typical student patterns</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {SAMPLE_PROFILES.map((preset) => {
              const isSelected = activePreset === preset.label;
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/15 border-cyan-400/50 text-white shadow-sm'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/20 text-slate-300 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="text-xs font-semibold text-white mb-0.5">{preset.label}</div>
                  <div className="text-[11px] text-slate-400 line-clamp-1">{preset.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Assessment Form Card */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Personal Information */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">1. Personal Information</h3>
                <p className="text-xs text-slate-400">Demographic parameters used for baseline normalization</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Age */}
              <div>
                <label htmlFor="age" className="block text-xs font-semibold text-slate-300 mb-2">
                  Age <span className="text-cyan-400">*</span>
                  <span className="text-slate-400 font-normal ml-1">(Years, 10–100)</span>
                </label>
                <input
                  id="age"
                  type="number"
                  min={10}
                  max={100}
                  value={formData.age}
                  onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${
                    errors.age ? 'border-rose-500/60 focus:border-rose-400' : 'border-white/10 focus:border-cyan-400'
                  } text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors`}
                  placeholder="21"
                  required
                />
                {errors.age && <p className="text-xs text-rose-400 mt-1.5">{errors.age}</p>}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Gender <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Female', 'Male'] as Gender[]).map((genderOption) => (
                    <button
                      key={genderOption}
                      type="button"
                      onClick={() => handleFieldChange('gender', genderOption)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                        formData.gender === genderOption
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                          : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white'
                      }`}
                    >
                      {genderOption}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-xs font-semibold text-slate-300 mb-2">
                  Country <span className="text-cyan-400">*</span>
                  <span className="text-slate-400 font-normal ml-1">(Top regional categories)</span>
                </label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleFieldChange('country', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  required
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
                {errors.country && <p className="text-xs text-rose-400 mt-1.5">{errors.country}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">2. Academic Background</h3>
                <p className="text-xs text-slate-400">Educational context and primary intent of digital device use</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Academic Level */}
              <div>
                <label htmlFor="academic_level" className="block text-xs font-semibold text-slate-300 mb-2">
                  Academic Level <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="academic_level"
                  value={formData.academic_level}
                  onChange={(e) => handleFieldChange('academic_level', e.target.value as AcademicLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  required
                >
                  {ACADEMIC_LEVELS.map((level) => (
                    <option key={level.value} value={level.value} className="bg-slate-900 text-white">
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Purpose of Use */}
              <div>
                <label htmlFor="purpose_of_use" className="block text-xs font-semibold text-slate-300 mb-2">
                  Primary Purpose of Use <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="purpose_of_use"
                  value={formData.purpose_of_use}
                  onChange={(e) => handleFieldChange('purpose_of_use', e.target.value as PurposeOfUse)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                  required
                >
                  {PURPOSES_OF_USE.map((purpose) => (
                    <option key={purpose.value} value={purpose.value} className="bg-slate-900 text-white">
                      {purpose.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Digital Habits */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">3. Digital Habits</h3>
                <p className="text-xs text-slate-400">Platform preferences, screen duration, and daily device activations</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Most Used Platform */}
              <div>
                <label htmlFor="most_used_platform" className="block text-xs font-semibold text-slate-300 mb-2">
                  Most Used Social Platform <span className="text-cyan-400">*</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const isSelected = formData.most_used_platform === platform;
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => handleFieldChange('most_used_platform', platform)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-medium border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-violet-500/20 border-violet-400 text-violet-200 shadow-sm'
                            : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                        }`}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {/* Avg Daily Usage Hours */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="avg_daily_usage_hours" className="text-xs font-semibold text-slate-300">
                      Avg Daily Usage Hours <span className="text-cyan-400">*</span>
                    </label>
                    <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">
                      {formData.avg_daily_usage_hours} hrs / day
                    </span>
                  </div>
                  <input
                    id="avg_daily_usage_hours"
                    type="range"
                    min={0}
                    max={24}
                    step={0.1}
                    value={formData.avg_daily_usage_hours}
                    onChange={(e) => handleFieldChange('avg_daily_usage_hours', parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>0h (Minimal)</span>
                    <span>12h (Heavy)</span>
                    <span>24h (Max)</span>
                  </div>
                  {errors.avg_daily_usage_hours && (
                    <p className="text-xs text-rose-400 mt-1.5">{errors.avg_daily_usage_hours}</p>
                  )}
                </div>

                {/* Daily Unlocks */}
                <div>
                  <label htmlFor="daily_unlocks" className="block text-xs font-semibold text-slate-300 mb-2">
                    Daily Device Unlocks <span className="text-cyan-400">*</span>
                    <span className="text-slate-400 font-normal ml-1">(Phone check frequency)</span>
                  </label>
                  <input
                    id="daily_unlocks"
                    type="number"
                    min={0}
                    step={1}
                    value={formData.daily_unlocks}
                    onChange={(e) => handleFieldChange('daily_unlocks', parseInt(e.target.value) || 0)}
                    className={`w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border ${
                      errors.daily_unlocks
                        ? 'border-rose-500/60 focus:border-rose-400'
                        : 'border-white/10 focus:border-cyan-400'
                    } text-white text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-colors`}
                    placeholder="120"
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Typical student average in dataset: ~170 unlocks/day</p>
                  {errors.daily_unlocks && (
                    <p className="text-xs text-rose-400 mt-1.5">{errors.daily_unlocks}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Lifestyle and Wellbeing */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-heading">4. Lifestyle & Wellbeing</h3>
                <p className="text-xs text-slate-400">Restorative hours, physical movement, study volume, and perceived stress</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Study Hours */}
              <div>
                <label htmlFor="study_hours" className="block text-xs font-semibold text-slate-300 mb-2">
                  Study Hours <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="study_hours"
                    type="number"
                    min={0}
                    max={24}
                    step={0.1}
                    value={formData.study_hours}
                    onChange={(e) => handleFieldChange('study_hours', parseFloat(e.target.value) || 0)}
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">hrs</span>
                </div>
                {errors.study_hours && <p className="text-xs text-rose-400 mt-1.5">{errors.study_hours}</p>}
              </div>

              {/* Physical Activity Hours */}
              <div>
                <label htmlFor="physical_activity_hours" className="block text-xs font-semibold text-slate-300 mb-2">
                  Physical Activity <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="physical_activity_hours"
                    type="number"
                    min={0}
                    max={24}
                    step={0.1}
                    value={formData.physical_activity_hours}
                    onChange={(e) =>
                      handleFieldChange('physical_activity_hours', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">hrs</span>
                </div>
                {errors.physical_activity_hours && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.physical_activity_hours}</p>
                )}
              </div>

              {/* Sleep Hours Per Night */}
              <div>
                <label htmlFor="sleep_hours_per_night" className="block text-xs font-semibold text-slate-300 mb-2">
                  Sleep Per Night <span className="text-cyan-400">*</span>
                </label>
                <div className="relative">
                  <input
                    id="sleep_hours_per_night"
                    type="number"
                    min={0}
                    max={24}
                    step={0.1}
                    value={formData.sleep_hours_per_night}
                    onChange={(e) =>
                      handleFieldChange('sleep_hours_per_night', parseFloat(e.target.value) || 0)
                    }
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs text-slate-400">hrs</span>
                </div>
                {errors.sleep_hours_per_night && (
                  <p className="text-xs text-rose-400 mt-1.5">{errors.sleep_hours_per_night}</p>
                )}
              </div>

              {/* Stress Level */}
              <div>
                <label htmlFor="stress_level" className="block text-xs font-semibold text-slate-300 mb-2">
                  Stress Level <span className="text-cyan-400">*</span>
                </label>
                <select
                  id="stress_level"
                  value={formData.stress_level}
                  onChange={(e) => handleFieldChange('stress_level', e.target.value as StressLevel)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/60 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                  required
                >
                  {STRESS_LEVELS.map((s) => (
                    <option key={s.value} value={s.value} className="bg-slate-900 text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Stress level badge pill preview */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Selected Stress Rating:</span>
              {STRESS_LEVELS.map((s) => {
                if (s.value === formData.stress_level) {
                  return (
                    <span
                      key={s.value}
                      className={`px-2.5 py-0.5 rounded-full border font-semibold ${s.bg} ${s.color}`}
                    >
                      {s.label}
                    </span>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* Server Error Alert Banner */}
          {serverError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-rose-200">Prediction Request Failed</div>
                <div className="text-xs mt-0.5 leading-relaxed">{serverError}</div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={onClear}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>

            <button
              type="submit"
              disabled={isLoading || !isFormValid}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-300 hover:from-cyan-300 hover:to-sky-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-400/40 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Computing Prediction...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>Run Model Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
