import React, { Suspense } from 'react';
import { LoginContent } from '@/components/LoginContent';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <div className="min-h-screen relative flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#163A5F]">
      {/* Background Campus Image with Overlay & Blur */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80"
          alt="Dhaanish Campus Background"
          className="w-full h-full object-cover scale-105 filter blur-xs brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#163A5F]/85 via-[#102a46]/80 to-[#0b1c2e]/90 backdrop-blur-xs" />
      </div>

      <Suspense fallback={<div className="text-center text-white z-10 my-auto">Loading...</div>}>
        <LoginContent />
      </Suspense>

      <footer className="text-center text-xs text-slate-200 font-medium z-10 drop-shadow-md">
        &copy; 2026 Dhaanish Chennai Career & Professional Development Center. All rights reserved.
      </footer>
    </div>
  );
}
