import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  CheckCircle2, 
  Clock, 
  CreditCard,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

interface TransactionLedgerProps {
  transactions: Transaction[];
  title?: string;
  className?: string;
}

export const TransactionLedger: FC<TransactionLedgerProps> = ({ transactions, title = "Transaction Ledger", className }) => {
  return (
    <div className={cn("bg-white border border-[#E8DDD0] rounded-[2rem] overflow-hidden shadow-sm", className)}>
      <div className="p-6 border-b border-[#E8DDD0] flex justify-between items-center">
        <h3 className="font-black text-[#0D1B2A] tracking-tight flex items-center gap-2">
          <CreditCard size={18} className="text-[#C9A84C]" />
          {title}
        </h3>
        <button className="text-gray-400 hover:text-gray-900 transition-colors">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Type</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Source/Destination</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx, idx) => (
              <motion.tr 
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50/80 transition-colors group"
              >
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105",
                      tx.type === 'Deposit' ? "bg-emerald-100 text-emerald-600" :
                      tx.type === 'Lock' ? "bg-amber-100 text-amber-600" :
                      tx.type === 'Release' ? "bg-blue-100 text-blue-600" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {tx.type === 'Deposit' && <ArrowDownLeft size={20} />}
                      {tx.type === 'Lock' && <Lock size={20} />}
                      {tx.type === 'Release' && <ArrowUpRight size={20} />}
                      {tx.type === 'Arbitration' && <ShieldCheck size={20} />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-sm">{tx.description}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{tx.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-2">
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-gray-600">{tx.toName}</span>
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider">{tx.fromName}</span>
                     </div>
                   </div>
                </td>
                <td className="px-6 py-4">
                   <span className={cn(
                     "font-black text-sm",
                     tx.type === 'Deposit' ? "text-emerald-600" : "text-gray-900"
                   )}>
                     {tx.type === 'Deposit' ? '+' : ''}{formatCurrency(tx.amount)}
                   </span>
                </td>
                <td className="px-6 py-4">
                   <div className="flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-emerald-50 border border-emerald-100 w-fit">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Completed</span>
                   </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
