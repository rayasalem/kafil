import { FC } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface TrustScoreProps {
  score: number;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const TrustScore: FC<TrustScoreProps> = ({ score, label = "Trust Score", className, size = 'md' }) => {
  const isHigh = score >= 90;
  const isMed = score >= 70 && score < 90;
  
  const statusColor = isHigh ? "text-emerald-500" : isMed ? "text-[#C9A84C]" : "text-red-500";
  const bgColor = isHigh ? "bg-emerald-500/10" : isMed ? "bg-[#C9A84C]/10" : "bg-red-500/10";
  const borderColor = isHigh ? "border-emerald-500/20" : isMed ? "border-[#C9A84C]/20" : "border-red-500/20";

  return (
    <div className={cn(
      "flex flex-col gap-2 p-4 rounded-3xl border-2 transition-all hover:shadow-md",
      bgColor, borderColor, className
    )}>
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{label}</span>
        {isHigh ? <ShieldCheck size={14} className={statusColor} /> : <AlertCircle size={14} className={statusColor} />}
      </div>
      
      <div className="flex items-end gap-2">
        <span className={cn("font-black leading-none", size === 'lg' ? "text-4xl" : "text-2xl", statusColor)}>
          {score}%
        </span>
        <div className="flex flex-col gap-0.5 mb-1">
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-tighter text-emerald-600">
            <TrendingUp size={10} /> +2.4%
          </div>
        </div>
      </div>

      <div className="w-full bg-gray-200/50 h-1 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          className={cn("h-full rounded-full transition-all duration-1000", isHigh ? "bg-emerald-500" : isMed ? "bg-[#C9A84C]" : "bg-red-500")}
        />
      </div>
    </div>
  );
};
