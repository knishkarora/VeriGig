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
    sm: 'text-[11px] px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <span 
      className={`inline-flex items-center rounded-full font-bold transition-all duration-200 border ${
        type === 'student'
          ? 'bg-emerald-50 text-emerald-800 border-emerald-300/80 shadow-sm'
          : type === 'sme'
          ? 'bg-purple-50 text-purple-900 border-purple-200 shadow-sm'
          : type === 'admin'
          ? 'bg-slate-100 text-slate-900 border-slate-300'
          : 'bg-emerald-50 text-emerald-800 border-emerald-300/80'
      } ${sizeClasses[size]} ${className}`}
    >
      {type === 'student' ? (
        <Award size={iconSizes[size]} className="text-emerald-600 shrink-0" />
      ) : type === 'sme' ? (
        <ShieldCheck size={iconSizes[size]} className="text-purple-600 shrink-0" />
      ) : (
        <CheckCircle2 size={iconSizes[size]} className="text-emerald-600 shrink-0" />
      )}
      <span className="tracking-tight">{defaultText}</span>
    </span>
  );
};
