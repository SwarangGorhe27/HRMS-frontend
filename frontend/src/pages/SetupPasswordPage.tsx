import { useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, Lock } from 'lucide-react';
import api from '@api/client';
import { cn } from '@utils/utils';

export function SetupPasswordPage() {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordValid || !passwordsMatch || !token) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      await api.post('/auth/setup-password/', { token, password });
      setStatus('success');
    } catch (err: unknown) {
      setStatus('error');
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setErrorMsg(axiosErr?.response?.data?.detail || 'Failed to set password. The link may have expired.');
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-[var(--surface-0)]">
        <div className="max-w-sm text-center">
          <Lock className="mx-auto h-12 w-12 text-red-400" />
          <h1 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">Invalid Link</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-white/40">
            This invitation link is invalid. Please contact your HR administrator.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-50 dark:bg-[var(--surface-0)]">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h1 className="mt-4 text-lg font-semibold text-surface-900 dark:text-white">Password Set Successfully!</h1>
          <p className="mt-2 text-sm text-surface-500 dark:text-white/40">
            Your account is ready. You can now log in with your work email and the password you just created.
          </p>
          <a
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full rounded-lg border border-surface-200 bg-surface-0 px-3 py-2.5 text-sm text-surface-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-white/10 dark:bg-[var(--surface-50)] dark:text-white dark:focus:border-brand-400';

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 p-4 dark:bg-[var(--surface-0)]">
      <div className="w-full max-w-md">
        {/* Logo/branding */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-bold text-white shadow-lg">
            HR
          </div>
          <h1 className="mt-4 text-xl font-bold text-surface-900 dark:text-white">Set Up Your Password</h1>
          <p className="mt-1 text-sm text-surface-500 dark:text-white/40">
            Welcome to HRMS! Create a password to access your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="surface-card rounded-2xl border border-surface-100 p-6 shadow-sm dark:border-white/5">
          {/* Password */}
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-medium text-surface-600 dark:text-white/50">
              <KeyRound className="mr-1 inline h-3 w-3" /> New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Minimum 8 characters"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-surface-400 hover:text-surface-600 dark:text-white/30 dark:hover:text-white/50"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      password.length >= i * 3
                        ? password.length >= 12
                          ? 'bg-emerald-500'
                          : password.length >= 8
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        : 'bg-surface-200 dark:bg-white/10',
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="mb-1.5 block text-xs font-medium text-surface-600 dark:text-white/50">
              <Lock className="mr-1 inline h-3 w-3" /> Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={cn(inputClass, confirmPassword && !passwordsMatch && 'border-red-400 focus:border-red-500 focus:ring-red-500/20')}
              placeholder="Re-enter your password"
              required
            />
            {confirmPassword && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match.</p>
            )}
          </div>

          {/* Error */}
          {status === 'error' && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
              {errorMsg}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === 'loading' || !passwordValid || !passwordsMatch}
            className="w-full rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-brand-500 dark:hover:bg-brand-600"
          >
            {status === 'loading' ? 'Setting password...' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
