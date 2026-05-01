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
  MoreVertical,
} from 'lucide-react';
import { Transaction } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

interface TransactionLedgerProps {
  transactions: Transaction[];
  title?: string;
  className?: string;
}

export const TransactionLedger: FC<TransactionLedgerProps> = ({
  transactions,
  title = 'Transaction Ledger',
  className,
}) => {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[2rem] border border-[#E8DDD0] bg-white shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[#E8DDD0] p-6">
        <h3 className="flex items-center gap-2 font-black tracking-tight text-[#0D1B2A]">
          <CreditCard size={18} className="text-[#C9A84C]" />
          {title}
        </h3>
        <button className="text-gray-400 transition-colors hover:text-gray-900">
          <MoreVertical size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-6 py-4 text-center text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Type
              </th>
              <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Description
              </th>
              <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Source/Destination
              </th>
              <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Amount
              </th>
              <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {transactions.map((tx, idx) => (
              <motion.tr
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group transition-colors hover:bg-gray-50/80"
              >
                <td className="px-6 py-4">
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm transition-transform group-hover:scale-105',
                        tx.type === 'Deposit'
                          ? 'bg-emerald-100 text-emerald-600'
                          : tx.type === 'Lock'
                            ? 'bg-amber-100 text-amber-600'
                            : tx.type === 'Release'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-600'
                      )}
                    >
                      {tx.type === 'Deposit' && <ArrowDownLeft size={20} />}
                      {tx.type === 'Lock' && <Lock size={20} />}
                      {tx.type === 'Release' && <ArrowUpRight size={20} />}
                      {tx.type === 'Arbitration' && <ShieldCheck size={20} />}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">{tx.description}</span>
                    <span className="font-mono text-[10px] text-gray-400">{tx.id}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-600">{tx.toName}</span>
                      <span className="text-[10px] tracking-wider text-gray-400 uppercase">
                        {tx.fromName}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      'text-sm font-black',
                      tx.type === 'Deposit' ? 'text-emerald-600' : 'text-gray-900'
                    )}
                  >
                    {tx.type === 'Deposit' ? '+' : ''}
                    {formatCurrency(tx.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex w-fit items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span className="text-[10px] font-black tracking-wider text-emerald-700 uppercase">
                      Completed
                    </span>
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
