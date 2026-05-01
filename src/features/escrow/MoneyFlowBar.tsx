import { FC } from 'react';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

interface MoneyFlowBarProps {
  budget: number;
  paid: number;
  allocated: number;
}

import { motion } from 'framer-motion';

const MoneyFlowBar: FC<MoneyFlowBarProps> = ({ budget, paid, allocated }) => {
  const remaining = budget - allocated;
  const paidWidth = (paid / budget) * 100;
  const allocatedWidth = ((allocated - paid) / budget) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
        <span className="flex items-center gap-2">
           <div className="w-1 h-1 bg-[#C9A84C] rounded-full animate-pulse" />
           Escrow Liquidity Pipeline
        </span>
        <span>Allocated: <span className="text-[#0D1B2A]">{formatCurrency(allocated)}</span> / {formatCurrency(budget)}</span>
      </div>
      <div className="h-6 w-full bg-gray-100/50 rounded-2xl overflow-hidden flex shadow-inner border border-gray-100 p-1">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${paidWidth}%` }}
          className="h-full bg-emerald-500 rounded-xl flex items-center justify-center text-[9px] text-white font-black uppercase tracking-widest relative" 
          title={`Released: ${formatCurrency(paid)}`}
        >
          {paidWidth > 15 && <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Released</span>}
        </motion.div>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${allocatedWidth}%` }}
          className="h-full bg-[#0D1B2A] rounded-xl ml-1 flex items-center justify-center text-[9px] text-white font-black uppercase tracking-widest relative shadow-lg" 
          title={`Locked: ${formatCurrency(allocated - paid)}`}
        >
          {allocatedWidth > 15 && <span className="flex items-center gap-1"><Lock size={10} /> Locked</span>}
        </motion.div>
      </div>
      <div className="flex flex-wrap gap-6 mt-5 bg-white/40 p-4 rounded-2xl border border-white/60">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Released</span>
            <span className="text-xs font-bold text-gray-700">{formatCurrency(paid)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-r border-gray-100 pr-6">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0D1B2A] ring-4 ring-gray-100" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">In Escrow</span>
            <span className="text-xs font-bold text-gray-700">{formatCurrency(allocated - paid)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 border-r border-gray-100 pr-6">
          <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Available</span>
            <span className="text-xs font-bold text-gray-700">{formatCurrency(remaining)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { CheckCircle2, Lock } from 'lucide-react';

export default MoneyFlowBar;
