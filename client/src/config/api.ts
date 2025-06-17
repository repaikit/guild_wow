// API configuration
const isDevelopment = process.env.NODE_ENV === "development";

// Base URL for API calls
export const API_BASE_URL = isDevelopment
  ? "http://localhost:5000"
  : process.env.NEXT_PUBLIC_API_URL || "";

console.log("bạn đang kết nối tới" + API_BASE_URL);
// WebSocket URL
export const WS_BASE_URL = isDevelopment
  ? "ws://localhost:5000"
  : process.env.NEXT_PUBLIC_WS_URL || "";

export const API_ENDPOINTS = {

users: {
    me: `${API_BASE_URL}/api/me`,
    googleAuth: `${API_BASE_URL}/api/auth/google`,
    googleCallback: `${API_BASE_URL}/api/auth/google/callback`,
    createGuest: `${API_BASE_URL}/api/guest`,
    getGuest: (sessionId: string) => `${API_BASE_URL}/api/guest/${sessionId}`,

    verifyEmail: `${API_BASE_URL}/api/auth/verify-email`,

    login: `${API_BASE_URL}/api/auth/login`,
    register: `${API_BASE_URL}/api/auth/register`,
    GoogleLogin: `${API_BASE_URL}/api/auth/google`,
    GoogleRegister: `${API_BASE_URL}/api/auth/google/register`,

    decodeWalletInfo: `${API_BASE_URL}/api/users/decode-wallet-info`,

    refreshToken: `${API_BASE_URL}/api/auth/refresh`,
    // Upgrade Guest
    upgradeGuest: `${API_BASE_URL}/api/upgrade`,

    // refresh guest
    refreshGuest: `${API_BASE_URL}/api/guest/refresh`,

    play: `${API_BASE_URL}/api/play`,
    leaderboard: `${API_BASE_URL}/api/leaderboard`,
    deleteMe: `${API_BASE_URL}/api/me`,

    updateProfile: `${API_BASE_URL}/api/me`,
    levelUp: `${API_BASE_URL}/api/level-up`,

    getById: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,

    getByEmail: (email: string) => `${API_BASE_URL}/api/users/email/${email}`,
    getByWallet: (wallet: string) =>
      `${API_BASE_URL}/api/users/wallet/${wallet}`,
    deleteById: (userId: string) => `${API_BASE_URL}/api/users/${userId}`,

    weeklyStats: `${API_BASE_URL}/api/me/weekly-stats`,

    upgradeToPro: `${API_BASE_URL}/api/upgrade-to-pro`,
    incrementNftMinted: `${API_BASE_URL}/api/users/increment-nft-minted`,
  },

  guilds: {
    create: `${API_BASE_URL}/api/guild/create`,
    leave: `${API_BASE_URL}/api/guild/leave`,
    me: `${API_BASE_URL}/api/guild/me`,
    invite: `${API_BASE_URL}/api/guild/invite`,
    reset: `${API_BASE_URL}/api/guild/reset`,
    search: (keyword: string) =>
  `${API_BASE_URL}/api/guild/search?keyword=${encodeURIComponent(keyword)}`,

    join: `${API_BASE_URL}/api/guild/join`,
    explore: `${API_BASE_URL}/api/guild/explore`,
  },

}

export const defaultFetchOptions = {
  headers: {
    Accept: "application/json",
  },
};