export type Language = 'ko' | 'en';

export type ActiveTab = 'home' | 'history' | 'profile';

export interface UserProfile {
  name: string;
  email: string;
  membershipKo: string;
  membershipEn: string;
  isVerified: boolean;
  avatarUrl: string;
  totalWins: number;
  oracleRank: string;
}

export interface LottoSet {
  id: string;
  numbers: number[];
  luckyIndex: number; // index of the highlighted green ball
  timestamp: number;
  timeKo: string;
  timeEn: string;
  luckScore: number;
  drawId: string;
}

export interface NotificationSettings {
  drawReminders: boolean;
  luckyDayAlerts: boolean;
  soundEffects: boolean;
  hapticFeedback: boolean;
}
