import type { StudentDataRequest } from '../types/api';

export const BACKEND_URL = 'http://127.0.0.1:2200';
export const PREDICT_ENDPOINT = `${BACKEND_URL}/predict`;
export const OPENAPI_ENDPOINT = `${BACKEND_URL}/openapi.json`;
export const DOCS_URL = `${BACKEND_URL}/docs`;

export const COUNTRIES = [
  'India',
  'USA',
  'Canada',
  'Australia',
  'UK',
  'Germany',
  'Mexico',
  'Turkey',
  'France',
  'Japan',
  'South Korea',
  'Brazil',
  'Spain',
  'Italy',
  'Singapore',
  'Other',
];

export const ACADEMIC_LEVELS = [
  { value: 'High School', label: 'High School' },
  { value: 'Undergraduate', label: 'Undergraduate (Bachelor)' },
  { value: 'Graduate', label: 'Graduate (Master / PhD)' },
] as const;

export const SOCIAL_PLATFORMS = [
  'Instagram',
  'YouTube',
  'TikTok',
  'WhatsApp',
  'Snapchat',
  'Twitter',
  'LinkedIn',
  'Facebook',
  'WeChat',
  'LINE',
  'KakaoTalk',
  'VKontakte',
] as const;

export const PURPOSES_OF_USE = [
  { value: 'Education', label: 'Education & Study' },
  { value: 'Networking', label: 'Professional & Social Networking' },
  { value: 'Entertainment', label: 'Entertainment & Leisure' },
  { value: 'News', label: 'News & Current Affairs' },
] as const;

export const STRESS_LEVELS = [
  { value: 'Low', label: 'Low', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { value: 'Medium', label: 'Medium', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
  { value: 'High', label: 'High', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { value: 'Very High', label: 'Very High', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/30' },
] as const;

export const DEFAULT_FORM_VALUES: StudentDataRequest = {
  age: 21,
  gender: 'Female',
  country: 'India',
  academic_level: 'Undergraduate',
  most_used_platform: 'Instagram',
  purpose_of_use: 'Education',
  avg_daily_usage_hours: 3.5,
  daily_unlocks: 110,
  study_hours: 4.5,
  physical_activity_hours: 2.0,
  sleep_hours_per_night: 7.5,
  stress_level: 'Medium',
};

// Preset demo profiles for immediate user experimentation
export const SAMPLE_PROFILES: { label: string; description: string; data: StudentDataRequest }[] = [
  {
    label: 'Balanced Healthy Routine',
    description: 'High sleep (8h), good exercise (2.5h), moderate screen time (2h), low stress',
    data: {
      age: 22,
      gender: 'Female',
      country: 'Canada',
      academic_level: 'Undergraduate',
      most_used_platform: 'LinkedIn',
      purpose_of_use: 'Education',
      avg_daily_usage_hours: 1.8,
      daily_unlocks: 65,
      study_hours: 6.0,
      physical_activity_hours: 2.5,
      sleep_hours_per_night: 8.5,
      stress_level: 'Low',
    },
  },
  {
    label: 'High Digital Strain & Stress',
    description: 'Heavy screen time (7.5h), 230 unlocks, low sleep (4.5h), very high stress',
    data: {
      age: 20,
      gender: 'Male',
      country: 'USA',
      academic_level: 'Undergraduate',
      most_used_platform: 'TikTok',
      purpose_of_use: 'Entertainment',
      avg_daily_usage_hours: 7.5,
      daily_unlocks: 235,
      study_hours: 1.5,
      physical_activity_hours: 0.5,
      sleep_hours_per_night: 4.5,
      stress_level: 'Very High',
    },
  },
  {
    label: 'Average Student Baseline',
    description: 'Moderate study, 4.5h social media, 6.7h sleep, medium stress',
    data: {
      age: 21,
      gender: 'Male',
      country: 'India',
      academic_level: 'Undergraduate',
      most_used_platform: 'Facebook',
      purpose_of_use: 'Networking',
      avg_daily_usage_hours: 4.0,
      daily_unlocks: 134,
      study_hours: 4.5,
      physical_activity_hours: 2.2,
      sleep_hours_per_night: 6.7,
      stress_level: 'Medium',
    },
  },
];

// Model benchmarks derived directly from data.ipynb / training dataset
export const BENCHMARKS = {
  minScore: 3.6,
  medianScore: 6.1,
  meanScore: 6.23,
  maxScore: 9.4,
  scaleMin: 1.0,
  scaleMax: 10.0,
};
