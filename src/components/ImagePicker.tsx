'use client';

import React, { useState } from 'react';
import { Upload, Check, Loader2 } from 'lucide-react';

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImagePicker({ value, onChange, label = 'Select Image' }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    // Read instant Base64 preview first so image shows immediately
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onChange(dataUrl); // Set instant preview
      }

      // Upload to server to get permanent relative URL
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (res.ok && data.url) {
          onChange(data.url);
        }
      } catch (err) {
        console.error('Server upload failed, using Data URL fallback:', err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-[#1F2933]">{label}</label>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Device File Input Button */}
        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#163A5F] hover:bg-[#102a46] text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0">
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#D4A72C]" />
          ) : (
            <Upload className="w-4 h-4 text-[#D4A72C]" />
          )}
          <span>{uploading ? 'Uploading...' : 'Choose File from Device'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {/* Or URL input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste image URL link..."
            className="w-full px-3 py-2 border border-[#D9DEE3] rounded-xl text-xs font-normal bg-white"
          />
        </div>
      </div>

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-[#F7F8F5] rounded-xl border border-[#D9DEE3]">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#D9DEE3] bg-slate-200 shrink-0">
            <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-[11px] font-bold text-[#163A5F] flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Image Selected & Ready
            </p>
            <p className="text-[10px] text-[#667085] truncate">{value.substring(0, 60)}...</p>
          </div>
        </div>
      )}
    </div>
  );
}
