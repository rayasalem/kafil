import { FC } from 'react';
import { CheckCircle, Lock, Star } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format';

interface FreelancerStatsProps {
  earnings: number;
  escrowed: number;
  activeTasks: number;
}

export const FreelancerStats: FC<FreelancerStatsProps> = ({ earnings, escrowed, activeTasks }) => {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-10">
      <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-500" /> الأرباح المستلمة
        </p>
        <p className="text-4xl font-black text-[#0D1B2A]">{formatCurrency(earnings)}</p>
      </div>
      <div className="p-6 rounded-3xl shadow-lg bg-[#0D1B2A]">
        <p className="text-xs font-bold text-blue-200 uppercase mb-2 flex items-center gap-2">
          <Lock size={14} /> محجوز في كفيل (Escrow)
        </p>
        <p className="text-4xl font-black text-white">{formatCurrency(escrowed)}</p>
      </div>
      <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
          <Star size={14} className="text-[#C9A84C]" /> المهام النشطة
        </p>
        <p className="text-4xl font-black text-[#0D1B2A]">{activeTasks}</p>
      </div>
    </div>
  );
};
