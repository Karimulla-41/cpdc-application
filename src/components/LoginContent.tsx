'use client';

import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AlertTriangle, Mail, Lock, LogIn, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function LoginContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const authError = searchParams?.get('error');

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [callbackUrl, setCallbackUrl] = useState('http://localhost:3000/api/auth/callback/google');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCallbackUrl(`${window.location.origin}/api/auth/callback/google`);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      if (!session?.user?.profileCompleted) {
        router.replace('/complete-profile');
      } else {
        router.replace('/dashboard');
      }
    }
  }, [status, session, router]);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn('credentials', {
        email,
        password: password || 'cpdc2026',
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (res?.error) {
        setErrorMsg('Login failed. Please check your credentials.');
      } else if (res?.ok) {
        router.replace('/dashboard');
      }
    } catch (err) {
      setErrorMsg('Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="my-auto max-w-md w-full mx-auto space-y-6 bg-white/95 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl border border-white/40 z-10">
      {/* Header Branding */}
      <div className="text-center space-y-2">
        <div className="relative w-16 h-16 rounded-full bg-white border-2 border-[#D4A72C] flex items-center justify-center mx-auto shadow-md overflow-hidden p-1">
          <img
            src="/logo.png"
            alt="CPDC Official Emblem"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#1F2933] tracking-tight">
            CPDC Portal Login
          </h1>
          <p className="text-[#163A5F] font-extrabold text-xs uppercase tracking-wider mt-0.5">
            Dhaanish Chennai &bull; Career & Skill Hub
          </p>
        </div>
      </div>

      {authError && (
        <div className="p-3.5 rounded-xl bg-amber-50/95 border border-amber-200 text-amber-900 text-xs space-y-2">
          <div className="flex items-center gap-1.5 font-bold text-amber-950">
            <AlertTriangle className="w-4 h-4 text-[#C58A1A] shrink-0" />
            <span>Google OAuth Notice ({authError})</span>
          </div>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Google OAuth requires adding this exact URL to your Google Cloud Console:
            <br />
            <code className="mt-1 inline-block bg-amber-100/80 px-2 py-1 rounded text-[10px] font-mono text-amber-950 font-bold break-all select-all border border-amber-200">
              {callbackUrl}
            </code>
          </p>
          <div className="bg-amber-100/60 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-900 font-medium space-y-1">
            <p className="font-bold text-amber-950">💡 Recommended Instant Login Solution:</p>
            <p>
              Use <strong>"Sign In with Email"</strong> below! Simply type your email (e.g. <code className="bg-amber-200/70 px-1 rounded font-mono">staff@dhaanish.in</code> or <code className="bg-amber-200/70 px-1 rounded font-mono">student@dhaanish.in</code>) to sign in directly without Google OAuth.
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-red-50/95 border border-red-200 text-[#B54747] text-xs font-bold">
          {errorMsg}
        </div>
      )}

      {/* 1. EMAIL & PASSWORD LOGIN FORM */}
      <form onSubmit={handleCredentialsLogin} className="space-y-3 pt-1">
        <div>
          <label className="block text-xs font-bold text-[#1F2933] mb-1">Email Address *</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. staff@dhaanish.in or student@dhaanish.in"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-[#D9DEE3] rounded-xl text-xs font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#163A5F] focus:bg-white transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1F2933] mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-[#667085] absolute left-3.5 top-3" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-[#D9DEE3] rounded-xl text-xs font-medium text-[#1F2933] focus:outline-none focus:ring-2 focus:ring-[#163A5F] focus:bg-white transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-xl shadow-lg hover:shadow-xl transition disabled:opacity-50 mt-2"
        >
          <LogIn className="w-4 h-4 text-[#D4A72C]" />
          <span>{loading ? 'Logging In...' : 'Sign In with Email'}</span>
        </button>
      </form>

      {/* DIVIDER */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-[#D9DEE3] w-full" />
        <span className="bg-white px-3 text-[11px] font-bold text-[#667085] uppercase tracking-wider absolute">
          or continue with
        </span>
      </div>

      {/* 2. CONTINUE WITH GOOGLE BUTTON */}
      <div>
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-[#F7F8F5] text-[#1F2933] font-bold text-xs rounded-xl border border-[#D9DEE3] shadow-xs transition disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      </div>

      <div className="text-center pt-1">
        <Link
          href="/splash"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#163A5F] hover:underline"
        >
          <Sparkles className="w-3 h-3 text-[#D4A72C]" />
          <span>Replay Welcome Splash Screen</span>
        </Link>
      </div>
    </div>
  );
}
