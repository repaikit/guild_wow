import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/auth_context";
import { AppProvider } from "@/context/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
