'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShieldCheck } from 'lucide-react';

export default function SplashScreen() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    // Show splash screen animation for 2.5 seconds before navigating
    const timer = setTimeout(() => {
      if (status === 'authenticated') {
        if (!session?.user?.profileCompleted) {
          router.replace('/complete-profile');
        } else {
          router.replace('/dashboard');
        }
      } else {
        router.replace('/login');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [status, session, router]);

  return (
    <div className="min-h-screen bg-[#163A5F] flex flex-col items-center justify-center text-white px-4 relative overflow-hidden">
      {/* Background Campus Image with Blur & Dark Navy Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80"
          alt="Dhaanish Campus Background"
          className="w-full h-full object-cover scale-105 filter blur-xs brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#163A5F]/90 via-[#102a46]/85 to-[#0b1c2e]/95 backdrop-blur-xs" />
      </div>

      {/* Ambient Background Glow Effects */}
      <div className="absolute w-96 h-96 bg-[#2F6F7E]/30 rounded-full blur-3xl -top-20 -left-20 animate-pulse z-0" />
      <div className="absolute w-96 h-96 bg-[#D4A72C]/20 rounded-full blur-3xl -bottom-20 -right-20 animate-pulse z-0" />

      {/* Main Branding Card */}
      <div className="z-10 text-center flex flex-col items-center max-w-md w-full p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
        <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white border-4 border-[#D4A72C] flex items-center justify-center shadow-2xl mb-6 overflow-hidden p-2">
          <img
            src="/logo.png"
            alt="Dhaanish Chennai CPDC Emblem"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A72C] text-[#163A5F] text-[10px] font-extrabold uppercase tracking-wider mb-3 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" /> Official Institutional Portal
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2 text-white drop-shadow-md">
          CPDC PORTAL
        </h1>
        
        <p className="text-[#D4A72C] font-extrabold tracking-wider text-xs sm:text-sm uppercase mb-4 drop-shadow-xs">
          Career & Professional Development Center
        </p>

        <p className="text-slate-200 text-xs sm:text-sm font-medium mb-8 leading-relaxed">
          Dhaanish Chennai &bull; Empowering students for global placements, technical hackathons & executive leadership.
        </p>

        {/* Animated Loading Status */}
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-inner">
          <div className="w-4 h-4 border-2 border-[#D4A72C] border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="text-xs text-slate-100 font-semibold">
            Initializing CPDC System...
          </span>
        </div>
      </div>

      <div className="absolute bottom-6 text-[11px] text-slate-300 font-medium z-10 drop-shadow-sm">
        Dhaanish Chennai Educational Platform &bull; v2.5 Release
      </div>
    </div>
  );
}
