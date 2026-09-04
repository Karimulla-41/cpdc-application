'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserCheck, Lock, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react';
import { ImagePicker } from '@/components/ImagePicker';

export default function CompleteProfilePage() {
  const { data: session, update, status } = useSession();
  const router = useRouter();

  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'STAFF_COORDINATOR'>('STUDENT');
  const [department, setDepartment] = useState('CSE');
  const [year, setYear] = useState('3rd Year');
  const [section, setSection] = useState('A');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (session?.user) {
      if (session.user.profileCompleted) {
        router.replace('/dashboard');
      } else {
        setName(session.user.name || '');
        setProfileImage(session.user.image || '');
      }
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !phone) {
      setError('Please fill in required fields (Full Name and Phone Number).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          studentId: role === 'STUDENT' ? studentId : 'STAFF-ID',
          department,
          year: role === 'STUDENT' ? year : 'FACULTY',
          section,
          phone,
          profileImage,
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to complete profile');
      }

      // Update NextAuth session
      await update({ profileCompleted: true, role });

      // Redirect to main dashboard
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-[#163A5F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#163A5F]/10 text-[#163A5F] flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6 text-[#163A5F]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#163A5F] tracking-tight">Complete Profile Setup</h1>
            <p className="text-xs text-slate-500 font-medium">Initial Profile Setup for CPDC Portal</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Portal Role */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Portal Account Role *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('STUDENT')}
                className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                  role === 'STUDENT'
                    ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <GraduationCap className={`w-5 h-5 ${role === 'STUDENT' ? 'text-[#163A5F]' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-[#163A5F]">Student Member</p>
                  <p className="text-[10px] text-slate-500">Student Dashboard</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('STAFF_COORDINATOR')}
                className={`p-4 rounded-2xl border text-left transition flex items-center gap-3 ${
                  role === 'STAFF_COORDINATOR'
                    ? 'border-[#163A5F] bg-[#163A5F]/5 ring-2 ring-[#163A5F]'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <ShieldCheck className={`w-5 h-5 ${role === 'STAFF_COORDINATOR' ? 'text-[#D4A72C]' : 'text-slate-400'}`} />
                <div>
                  <p className="text-xs font-bold text-[#163A5F]">Staff Coordinator</p>
                  <p className="text-[10px] text-slate-500">Management Hub</p>
                </div>
              </button>
            </div>
          </div>

          {/* Read-Only Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span>Account Email</span>
              <span className="text-[11px] text-slate-400 font-normal flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-400" /> Google Auth Email
              </span>
            </label>
            <input
              type="email"
              value={session?.user?.email || ''}
              disabled
              className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 text-sm font-medium cursor-not-allowed"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shaik Karimulla"
              className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
            />
          </div>

          {/* Student ID / Staff Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {role === 'STUDENT' ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Student ID / Roll No. *
                </label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. 23CS105"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Staff ID / Designation
                </label>
                <input
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="e.g. Faculty Placement Advisor"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 9876543210"
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
              />
            </div>
          </div>

          {/* Department & Academic Year */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Department *
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
                <option value="AI&DS">AI & DS</option>
              </select>
            </div>

            {role === 'STUDENT' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year *
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Section
                  </label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    placeholder="e.g. A"
                    className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#163A5F] font-medium"
                  />
                </div>
              </>
            )}
          </div>

          {/* Profile Photo File Explorer */}
          <div>
            <ImagePicker
              label="Profile Photo (Select Picture from Device)"
              value={profileImage}
              onChange={setProfileImage}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-sm rounded-xl shadow-lg transition-all disabled:opacity-50 mt-4"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Save Profile & Enter Portal</span>
                <ArrowRight className="w-4 h-4 text-[#D4A72C]" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
