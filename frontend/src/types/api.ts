export type Gender = 'Male' | 'Female';

export type AcademicLevel = 'Undergraduate' | 'Graduate' | 'High School';

export type SocialPlatform =
  | 'Facebook'
  | 'LinkedIn'
  | 'Instagram'
  | 'Snapchat'
  | 'Twitter'
  | 'YouTube'
  | 'TikTok'
  | 'LINE'
  | 'KakaoTalk'
  | 'VKontakte'
  | 'WhatsApp'
  | 'WeChat';

export type PurposeOfUse = 'Networking' | 'Education' | 'Entertainment' | 'News';

export type StressLevel = 'Low' | 'Medium' | 'High' | 'Very High';

export interface StudentDataRequest {
  age: number;
  gender: Gender;
  country: string;
  academic_level: AcademicLevel;
  most_used_platform: SocialPlatform;
  purpose_of_use: PurposeOfUse;
  avg_daily_usage_hours: number;
  daily_unlocks: number;
  study_hours: number;
  physical_activity_hours: number;
  sleep_hours_per_night: number;
  stress_level: StressLevel;
}

export interface PredictionResponse {
  predicted_Mental_Health_Score: number;
}

export type ApiConnectionState = 'checking' | 'connected' | 'disconnected';

export interface FormValidationErrors {
  age?: string;
  gender?: string;
  country?: string;
  academic_level?: string;
  most_used_platform?: string;
  purpose_of_use?: string;
  avg_daily_usage_hours?: string;
  daily_unlocks?: string;
  study_hours?: string;
  physical_activity_hours?: string;
  sleep_hours_per_night?: string;
  stress_level?: string;
}
