import { FC } from 'react';
import { Lock, CheckCircle, ChevronLeft } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format';
import { MyTask } from '../hooks/useFreelancerDashboard';

interface FreelancerTaskRowProps {
  t: MyTask;
  onClick: (t: MyTask) => void;
}

export const FreelancerTaskRow: FC<FreelancerTaskRowProps> = ({ t, onClick }) => {
  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    Completed: { label: 'مكتمل', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'In Progress': { label: 'قيد التنفيذ', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    Pending: { label: 'في الانتظار', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    Disputed: { label: 'نزاع مفتوح', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  };

  const sc = statusConfig[t.status] || statusConfig['Pending'];

  return (
    <button
      onClick={() => onClick(t)}
      className="w-full text-right bg-white border border-[#E8DDD0] p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm hover:border-[#C9A84C]/30 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.paid ? 'bg-emerald-50' : 'bg-blue-50'}`}>
          {t.paid ? <CheckCircle size={22} className="text-emerald-600" /> : <Lock size={22} className="text-blue-600" />}
        </div>
        <div>
          <h3 className="font-bold text-lg text-[#0D1B2A]">{t.name}</h3>
          <p className="text-sm text-gray-400 mt-0.5">{t.projectName}</p>
          <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border mt-1 ${sc.bg} ${sc.color}`}>
            {sc.label}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right">
          <span className="block text-2xl font-black text-[#0D1B2A]">{formatCurrency(t.payment)}</span>
          {t.paid
            ? <span className="text-xs font-bold text-emerald-600">تم الدفع ✔</span>
            : <span className="text-xs font-bold text-[#C9A84C] flex items-center gap-1"><Lock size={10} /> محجوز بكفيل</span>
          }
        </div>
        <ChevronLeft size={18} className="text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
      </div>
    </button>
  );
};
