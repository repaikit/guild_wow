import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Zap } from "lucide-react";
import AuthForm from "@/components/AuthForm";
import { useAuth } from "@/context/auth_context";

export default function LoginPage() {
  const router = useRouter();
  const { loginAsGuest, isAuthenticated } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loadingGuest, setLoadingGuest] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  const handleGuestLogin = async () => {
    setLoadingGuest(true);
    try {
      await loginAsGuest();
      router.replace("/");
    } catch (error) {
      console.error(error);
      setError("Failed to log in as guest.");
    } finally {
      setLoadingGuest(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-rose-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 bg-white/5 border border-white/20 rounded-3xl shadow-xl backdrop-blur-lg">

        {/* Left side branding */}
        <div className="hidden lg:flex flex-col justify-center items-center text-center px-6">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg">
              <Zap className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-400 to-rose-400 text-transparent bg-clip-text">
            Guild Wow
          </h1>
          <p className="mt-4 text-white/70">
            Join the most vibrant L1 community. Play. Connect. Compete.
          </p>
        </div>

        {/* Right side form */}
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {mode === "login" ? "Sign In" : "Create an Account"}
            </h2>
            <p className="text-white/60">
              {mode === "login" ? "Welcome back!" : "Join the movement!"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 text-sm text-red-200 bg-red-500/20 border border-red-500/40 rounded-lg">
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="flex mb-6 bg-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 font-medium transition ${mode === "login"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Login
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 font-medium transition ${mode === "register"
                  ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white"
                  : "text-white/60 hover:text-white"
                }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <AuthForm
            mode={mode}
            onSuccess={() => router.replace("/")}
            onError={(msg) => setError(msg)}
          />

          {/* Continue as Guest */}
          <div className="my-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-4 text-white/60">or</span>
            </div>
          </div>

          <button
            onClick={handleGuestLogin}
            disabled={loadingGuest}
            className={`w-full py-3 rounded-xl font-semibold transition ${loadingGuest
                ? "bg-white/10 text-white/40 cursor-not-allowed"
                : "bg-white/20 text-white hover:bg-pink-500/20 border border-white/20 hover:border-pink-400"
              }`}
          >
            {loadingGuest ? "Logging in..." : "Continue as Guest"}
          </button>

          {/* Terms */}
          <p className="text-xs text-white/50 text-center mt-4">
            By continuing, you agree to our{" "}
            <a href="#" className="underline hover:text-pink-300">Terms</a> and{" "}
            <a href="#" className="underline hover:text-pink-300">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
