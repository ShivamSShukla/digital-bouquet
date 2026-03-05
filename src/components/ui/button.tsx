import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'outline' | 'ghost';
};

export function Button({ variant = 'default', className = '', ...props }: ButtonProps) {
  const variants: Record<string, string> = {
    default: 'bg-black text-white hover:bg-black/80',
    outline: 'border border-black text-black hover:bg-black/5',
    ghost: 'text-black hover:bg-black/5',
  };

  return (
    <button
      className={`rounded-2xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-black/40 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
