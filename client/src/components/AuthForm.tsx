import { useState } from "react";
import { API_ENDPOINTS } from "@/config/api";
import { useAuth } from "@/context/auth_context";

interface AuthFormProps {
  mode: "login" | "register";
  onSuccess?: (data: { access_token: string; token_type: string; user: Record<string, unknown> }) => void;
  onError?: (message: string) => void;
}

export default function AuthForm({ mode, onSuccess, onError }: AuthFormProps) {
  /* ⬇️  Gọi hook NGAY ĐÂU THÂN COMPONENT  */
  const { checkAuth } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint =
        mode === "login"
          ? API_ENDPOINTS.users.login
          : API_ENDPOINTS.users.register;

      const res  = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      /* 👉 Lưu token & cập nhật context */
      if (mode === "login") {
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type",  data.token_type);
        localStorage.setItem("user",        JSON.stringify(data.user));
        await checkAuth();              // <-- dùng biến đã lấy ở trên
      }

      onSuccess?.(data);
    } catch (err) {
      if (err instanceof Error) {
        onError?.(err.message || "Failed to authenticate.");
      } else {
        onError?.("An unexpected error occurred.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm text-white/70 mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="you@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm text-white/70 mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-pink-500"
          placeholder="Your password"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-3 font-semibold rounded-xl transition-all ${
          isSubmitting
            ? "bg-white/10 text-white/40 cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-110 text-white shadow-lg"
        }`}
      >
        {isSubmitting
          ? mode === "login"
            ? "Signing in…"
            : "Registering…"
          : mode === "login"
          ? "Sign In"
          : "Sign Up"}
      </button>
    </form>
  );
}
