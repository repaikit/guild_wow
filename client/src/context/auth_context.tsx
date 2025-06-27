import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { API_ENDPOINTS, defaultFetchOptions } from "@/config/api";

interface User {
  _id: string;
  user_type: string;
  name: string;
  avatar?: string;
  session_id?: string;
  kicker_skills?: string[];
  goalkeeper_skills?: string[];
  remaining_matches?: number;
  total_point?: number;
  created_at?: string;
  updated_at?: string;
  last_activity?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  logout: () => void;
  loginAsGuest: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  accessToken: null,
  loading: true,
  isAuthenticated: false,
  isLoading: true,
  checkAuth: async () => {},
  logout: () => {},
  loginAsGuest: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = useMemo(() => !!user, [user]);
  const isLoading = useMemo(() => loading, [loading]);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      setAccessToken(token);

      if (!token) {
        setUser(null);
        return;
      }

      const response = await fetch(API_ENDPOINTS.users.me, {
        method: "GET",
        headers: {
          ...defaultFetchOptions.headers,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          setAccessToken(null);
          setUser(null);
        }
        throw new Error("Failed to fetch user data");
      }

      const userData = await response.json();
      setUser(userData);
    } catch (err) {
      console.error("checkAuth error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = async () => {
    console.log("👉 loginAsGuest() được gọi");

    try {
      const res = await fetch(API_ENDPOINTS.users.createGuest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to login as guest");
      }

      const data = await res.json();
      localStorage.setItem("access_token", data.access_token);
      setAccessToken(data.access_token);

      await checkAuth();
    } catch (err) {
      console.error("Login as guest failed:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setAccessToken(null);
    setUser(null);
    router.push("/login");
  };

  useEffect(() => {
  const run = async () => {
    await checkAuth();
  };
  run();
}, []);


  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loading,
        isAuthenticated,
        isLoading,
        checkAuth,
        logout,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
