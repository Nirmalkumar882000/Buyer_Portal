import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  fullName: string;
  mobile: string;
  businessName?: string;
  sessionStart: number;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  user: AuthUser | null;
  otpAttempts: number;
  isOtpLocked: boolean;
  otpLockSecondsLeft: number;
  login: (user: AuthUser) => void;
  logout: (reason?: 'manual' | 'inactivity' | 'session_expired') => void;
  recordOtpAttempt: (success: boolean) => void;
  resetOtpAttempts: () => void;
  lastActivityAt: number;
  sessionSecondsLeft: number;
  inactivityWarning: boolean;
  dismissInactivityWarning: () => void;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const SESSION_KEY = 'vb_auth_session';
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000;   // 15 min → auto-logout
const INACTIVITY_WARN_MS = 14 * 60 * 1000;    // 14 min → show warning
const OTP_MAX_ATTEMPTS = 3;
const OTP_LOCKOUT_SECONDS = 120;                  // 2 min lockout after 3 wrong OTPs

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};

// ── Helper: read / write session storage ─────────────────────────────────────

function readSession(): AuthUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function writeSession(user: AuthUser | null) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
}

// ── Provider ──────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  onLogout?: (reason: 'manual' | 'inactivity' | 'session_expired') => void;
}> = ({ children, onLogout }) => {
  const [user, setUser] = useState<AuthUser | null>(readSession);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [isOtpLocked, setIsOtpLocked] = useState(false);
  const [otpLockSecondsLeft, setOtpLockSecondsLeft] = useState(0);
  const [lastActivityAt, setLastActivityAt] = useState(Date.now());
  const [sessionSecondsLeft, setSessionSecondsLeft] = useState(
    Math.round(INACTIVITY_TIMEOUT_MS / 1000)
  );
  const [inactivityWarning, setInactivityWarning] = useState(false);

  const isAuthenticated = !!user;
  const inactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const otpLockRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Logout ────────────────────────────────────────────────────────────────

  const logout = useCallback(
    (reason: 'manual' | 'inactivity' | 'session_expired' = 'manual') => {
      setUser(null);
      writeSession(null);
      localStorage.removeItem('buyer_token');
      localStorage.removeItem('buyer_user');
      setInactivityWarning(false);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      if (tickerRef.current) clearInterval(tickerRef.current);
      onLogout?.(reason);
    },
    [onLogout]
  );

  // ── Activity tracker ──────────────────────────────────────────────────────

  const resetActivityTimer = useCallback(() => {
    if (!isAuthenticated) return;

    setLastActivityAt(Date.now());
    setInactivityWarning(false);
    setSessionSecondsLeft(Math.round(INACTIVITY_TIMEOUT_MS / 1000));

    if (inactivityRef.current) clearTimeout(inactivityRef.current);
    
    // Auto-logout timer removed as requested:
    // inactivityRef.current = setTimeout(() => {
    //   logout('inactivity');
    // }, INACTIVITY_TIMEOUT_MS);
  }, [isAuthenticated]);

  // ── Session ticker (per-second countdown) ─────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) {
      if (tickerRef.current) clearInterval(tickerRef.current);
      return;
    }

    resetActivityTimer();

    // Session countdown ticker is disabled/removed to prevent auto-logout
    /*
    tickerRef.current = setInterval(() => {
      const idleSince = Date.now() - lastActivityAt;
      const remaining = Math.max(0, Math.round((INACTIVITY_TIMEOUT_MS - idleSince) / 1000));
      setSessionSecondsLeft(remaining);

      const shouldWarn = idleSince >= INACTIVITY_WARN_MS && idleSince < INACTIVITY_TIMEOUT_MS;
      setInactivityWarning(shouldWarn);
    }, 1000);
    */

    return () => {
      if (tickerRef.current) clearInterval(tickerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // ── Global activity listeners ─────────────────────────────────────────────

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handler = () => resetActivityTimer();
    events.forEach((e) => window.addEventListener(e, handler, { passive: true }));

    return () => {
      events.forEach((e) => window.removeEventListener(e, handler));
    };
  }, [isAuthenticated, resetActivityTimer]);

  // ── Login ─────────────────────────────────────────────────────────────────

  const login = useCallback((userData: AuthUser) => {
    const session: AuthUser = { ...userData, sessionStart: Date.now() };
    setUser(session);
    writeSession(session);
    setLastActivityAt(Date.now());
    setSessionSecondsLeft(Math.round(INACTIVITY_TIMEOUT_MS / 1000));
    setInactivityWarning(false);
  }, []);

  // ── OTP attempt tracking ──────────────────────────────────────────────────

  const recordOtpAttempt = useCallback((success: boolean) => {
    if (success) {
      setOtpAttempts(0);
      setIsOtpLocked(false);
      return;
    }

    setOtpAttempts((prev) => {
      const next = prev + 1;
      if (next >= OTP_MAX_ATTEMPTS) {
        setIsOtpLocked(true);
        setOtpLockSecondsLeft(OTP_LOCKOUT_SECONDS);

        if (otpLockRef.current) clearInterval(otpLockRef.current);
        otpLockRef.current = setInterval(() => {
          setOtpLockSecondsLeft((s) => {
            if (s <= 1) {
              clearInterval(otpLockRef.current!);
              setIsOtpLocked(false);
              setOtpAttempts(0);
              return 0;
            }
            return s - 1;
          });
        }, 1000);
      }
      return next;
    });
  }, []);

  const resetOtpAttempts = useCallback(() => {
    setOtpAttempts(0);
    setIsOtpLocked(false);
    if (otpLockRef.current) clearInterval(otpLockRef.current);
  }, []);

  const dismissInactivityWarning = useCallback(() => {
    setInactivityWarning(false);
    resetActivityTimer();
  }, [resetActivityTimer]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        otpAttempts,
        isOtpLocked,
        otpLockSecondsLeft,
        login,
        logout,
        recordOtpAttempt,
        resetOtpAttempts,
        lastActivityAt,
        sessionSecondsLeft,
        inactivityWarning,
        dismissInactivityWarning,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
