import React from 'react';
import { ShieldCheck, CheckCircle2, Award } from 'lucide-react';

interface TrustBadgeProps {
  type?: 'student' | 'sme' | 'admin' | 'verified';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TrustBadge: React.FC<TrustBadgeProps> = ({ 
  type = 'verified', 
  text, 
  size = 'md',
  className = '' 
}) => {
  const defaultText = 
    text || 
    (type === 'student' ? 'Verified Campus Talent' : 
     type === 'sme' ? 'Verified SME Partner' : 
     type === 'admin' ? 'Institutional Governance' : 'Verified');

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-medium transition-all duration-200 border ${
        type === 'student'
          ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 shadow-[0_0_12px_-3px_rgba(16,185,129,0.3)]'
          : type === 'sme'
          ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/30 shadow-[0_0_12px_-3px_rgba(99,102,241,0.3)]'
          : type === 'admin'
          ? 'bg-purple-950/40 text-purple-300 border-purple-500/30'
          : 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
      } ${sizeClasses[size]} ${className}`}
    >
      {type === 'student' ? (
        <Award size={iconSizes[size]} className="text-emerald-400 shrink-0" />
      ) : type === 'sme' ? (
        <ShieldCheck size={iconSizes[size]} className="text-indigo-400 shrink-0" />
      ) : (
        <CheckCircle2 size={iconSizes[size]} className="text-emerald-400 shrink-0" />
      )}
      <span className="tracking-tight">{defaultText}</span>
    </span>
  );
};
