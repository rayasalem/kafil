import { FC } from 'react';
import { ShieldCheck, User, Gavel, CheckCircle2, Clock } from 'lucide-react';
import { Task, Project } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

interface TaskRowProps {
  t: Task;
  project: Project;
  onApprove: (id: string) => void;
  onDispute: (t: Task) => void;
  onTaskClick: (t: Task) => void;
  userRole: string;
}

export const TaskRow: FC<TaskRowProps> = ({ t, project, onApprove, onDispute, onTaskClick, userRole }) => {
  const isPaid = t.paid;
  const isDisputed = t.status === 'Disputed';
  const isProgress = t.status === 'In Progress';

  const statusLabel = isPaid ? 'مكتمل' : isDisputed ? 'نزاع مفتوح' : isProgress ? 'قيد التنفيذ' : 'انتظار الاعتماد';
  const statusColor = isPaid ? 'text-emerald-600' : isDisputed ? 'text-red-600' : 'text-amber-600';

  return (
    <div 
      onClick={() => onTaskClick(t)}
      className={cn(
      'group relative bg-white border-2 p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-lg cursor-pointer',
      isPaid ? 'border-emerald-100 bg-emerald-50/20' :
      isDisputed ? 'border-red-100 bg-red-50/10' :
      t.inviteStatus === 'Pending' ? 'border-blue-100 bg-blue-50/20 opacity-80' : 'border-[#E8DDD0] hover:border-[#C9A84C]/30'
    )}>
      {isPaid && (
        <div className="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
          تم الدفع بنجاح
        </div>
      )}
      <div className="flex items-start gap-4 flex-1">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
          isPaid ? 'bg-emerald-100 text-emerald-600' :
          isDisputed ? 'bg-red-100 text-red-600' : 'bg-[#C9A84C]/10 text-[#C9A84C]'
        )}>
          {isPaid ? <CheckCircle2 size={24} /> : isDisputed ? <Gavel size={24} /> : <ShieldCheck size={24} />}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{t.name}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            <span className="text-gray-400 flex items-center gap-1.5 font-medium">
              <User size={14} className="text-gray-300" /> {t.assignedToName ?? t.assignedTo}
            </span>
            <span className={cn('flex items-center gap-1.5 font-bold', statusColor)}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {statusLabel}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto border-t-2 md:border-t-0 border-[#E8DDD0] pt-4 md:pt-0">
        <div className="text-left">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">مبلغ المهمة</span>
          <span className="text-xl font-black text-[#0D1B2A] leading-none">{formatCurrency(t.payment)}</span>
        </div>

        <div className="flex gap-2 mr-auto md:mr-0 flex-wrap">
          {!isPaid && (userRole === 'client' || userRole === 'admin') && (
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(t.id); }}
              className="flex items-center gap-2 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg whitespace-nowrap bg-[#1A7F74]"
            >
              <CheckCircle2 size={15} /> اعتماد وصرف
            </button>
          )}
          {!isPaid && !isDisputed && (userRole === 'client' || userRole === 'admin' || userRole === 'freelancer') && (
            <button
              onClick={(e) => { e.stopPropagation(); onDispute(t); }}
              className="flex items-center gap-2 text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm border-2 border-red-100 bg-white hover:bg-red-50"
            >
              <Gavel size={15} /> فتح نزاع
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
