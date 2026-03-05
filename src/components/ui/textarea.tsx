import React from 'react';

export function Textarea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`w-full rounded-2xl border border-black/20 bg-white/70 px-3 py-2 text-sm placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-pink-300 ${className}`}
      {...props}
    />
  );
}
