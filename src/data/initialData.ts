import { LottoSet, UserProfile, NotificationSettings } from '../types';

export const INITIAL_USER: UserProfile = {
  name: "Alexander Hunt",
  email: "alexander.hunt@oracle.io",
  membershipKo: "프리미엄 오라클 회원",
  membershipEn: "Premium Oracle Member",
  isVerified: true,
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHIA15Cc6Qj_Gtx_VfEyNs3Fy79MKmoIb3Iy0SK5s8LfdTOkJ7MDD2R_7iZoiHkpBRiGemw3psCp8SjpekCe_fQk5NX1qGSfLJTfcbJrEgGUM9dXj6AbJJVq_wgWrEVQBaSJL55OkiX-MIzw0wUG81oLO6PqbXzNqSJnFj1WP4swBFwdAbcYinR4wJeGIZ_86eV3LLjHry6ApZaOzGst-DcaTNHTb7ykjvEgDQtTiI2-fz59Y-QOdyg8QVEvR4E2xyMu7M3dupxFI",
  totalWins: 14,
  oracleRank: "#1,204"
};

export const INITIAL_PREDICTION: LottoSet = {
  id: "pred-init-01",
  numbers: [7, 14, 22, 31, 39, 45],
  luckyIndex: 2, // 22 is highlighted in green
  timestamp: Date.now(),
  timeKo: "오늘, 2:45 PM",
  timeEn: "Today, 2:45 PM",
  luckScore: 94,
  drawId: "#842-X"
};

export const INITIAL_HISTORY: LottoSet[] = [
  {
    id: "hist-1",
    numbers: [8, 14, 23, 31, 44, 52],
    luckyIndex: 2, // 23
    timestamp: Date.now() - 1000 * 60 * 35,
    timeKo: "오늘, 2:45 PM",
    timeEn: "Today, 2:45 PM",
    luckScore: 92,
    drawId: "#842-A"
  },
  {
    id: "hist-2",
    numbers: [3, 19, 22, 38, 41, 59],
    luckyIndex: 4, // 41
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    timeKo: "어제, 9:12 AM",
    timeEn: "Yesterday, 9:12 AM",
    luckScore: 95,
    drawId: "#841-B"
  },
  {
    id: "hist-3",
    numbers: [12, 15, 27, 33, 45, 50],
    luckyIndex: 5, // 50
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    timeKo: "10월 24일, 6:00 PM",
    timeEn: "Oct 24, 6:00 PM",
    luckScore: 88,
    drawId: "#840-C"
  },
  {
    id: "hist-4",
    numbers: [5, 11, 29, 36, 42, 58],
    luckyIndex: 0, // 05
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    timeKo: "10월 22일, 11:30 AM",
    timeEn: "Oct 22, 11:30 AM",
    luckScore: 96,
    drawId: "#839-D"
  },
  {
    id: "hist-5",
    numbers: [1, 7, 13, 25, 39, 48],
    luckyIndex: 5, // 48
    timestamp: Date.now() - 1000 * 60 * 60 * 180,
    timeKo: "10월 20일, 8:15 PM",
    timeEn: "Oct 20, 8:15 PM",
    luckScore: 90,
    drawId: "#838-E"
  }
];

export const INITIAL_NOTIFICATIONS: NotificationSettings = {
  drawReminders: true,
  luckyDayAlerts: true,
  soundEffects: true,
  hapticFeedback: true
};

export const HOTLINKED_ASSETS = {
  googleLogo: "https://lh3.googleusercontent.com/aida-public/AB6AXuAI0RBNTq9TVRJ9RjXtntd2GafV4X9vtpQXLI34_I_cf5WEzxQFlHEfQR1khtuvgMnITeleNN8yERSSmC5JfHCWG0TfAy-qzLBUz1KqYSiI23wVmYoCTfSQXUFWWQFf4NLnWRqwDLvK8CkZWJTvwISJwwUMi7y5-wRpWmBxavNh5XKMRq0NY9DFFyLDrUcN8PHCKPzIrrpWfU_Hf2gMJ86lWWm8Sb3o21BOo4zJ_HHwk_tRmURfjDp5nZhohs-hgO0yiEf7Grz89Oc",
  avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCHIA15Cc6Qj_Gtx_VfEyNs3Fy79MKmoIb3Iy0SK5s8LfdTOkJ7MDD2R_7iZoiHkpBRiGemw3psCp8SjpekCe_fQk5NX1qGSfLJTfcbJrEgGUM9dXj6AbJJVq_wgWrEVQBaSJL55OkiX-MIzw0wUG81oLO6PqbXzNqSJnFj1WP4swBFwdAbcYinR4wJeGIZ_86eV3LLjHry6ApZaOzGst-DcaTNHTb7ykjvEgDQtTiI2-fz59Y-QOdyg8QVEvR4E2xyMu7M3dupxFI",
  goldenWavesBanner: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm-y3js7K4WaoPzKrTuYnWaVzDyPmzs5ds7bKMxQGA8YvHH1yFNHw0860_lHLhmfJ6NQNX5EAUpO5UCBUvRQwUXaBD6t0_2r9MRFXUu1K_CDJP2kN9Z5YYktYZptcNWRskZjR1Ijvset1FnWqQla4KD9LBVhBj6VVK8zDDg8xAfllG4EpQP7r_olECITN7ymztJ5UA6ImDMPTDbd6euLprXnje9uYxbJfrj3H2PKTVzVE-BcLmH7CbZjzIUcv7b7uduW72o2wvQ8s"
};
