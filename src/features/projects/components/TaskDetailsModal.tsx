import { FC } from 'react';
import { X, FileText, User, CalendarDays, Upload, CheckCircle2 } from 'lucide-react';
import { Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

interface TaskDetailsModalProps {
  task: Task;
  onClose: () => void;
  onApprove: (id: string) => void;
  userRole: string;
}

export const TaskDetailsModal: FC<TaskDetailsModalProps> = ({ task, onClose, onApprove, userRole }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/40 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-[#E8DDD0] overflow-hidden">
        <div className="bg-gray-50 border-b border-[#E8DDD0] px-6 py-5 flex justify-between items-center">
          <h2 className="font-black text-gray-900 text-lg flex items-center gap-2">
            <FileText size={20} className="text-[#C9A84C]" /> تفاصيل التسليم
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"><X size={18} /></button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <p className="text-xs font-bold text-gray-400 mb-1">المهمة</p>
            <p className="font-black text-lg text-gray-900">{task.name}</p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400">المستقل</p>
              <p className="text-sm font-bold text-[#0D1B2A] flex items-center gap-1.5"><User size={14} className="text-[#C9A84C]" /> {task.assignedToName ?? task.assignedTo}</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-400">تاريخ التسليم</p>
              <p className="text-sm font-bold text-[#0D1B2A] flex items-center gap-1.5"><CalendarDays size={14} className="text-[#C9A84C]" /> {task.deadline ?? 'غير محدد'}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-black text-[#0D1B2A] mb-3">الملفات المسلمة</p>
            {task.deliverableFile ? (
              <div className="p-4 border-2 border-dashed border-emerald-200 bg-emerald-50 rounded-xl flex items-center justify-between">
                <p className="text-sm font-bold text-emerald-800">{task.deliverableFile}</p>
                <button className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200">تحميل</button>
              </div>
            ) : (
              <div className="p-8 text-center border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl text-gray-400 font-bold text-sm">لم يتم التسليم بعد</div>
            )}
          </div>

          {task.deliverableFile && !task.paid && (userRole === 'client' || userRole === 'admin') && (
            <button 
              onClick={() => { onApprove(task.id); onClose(); }} 
              className="w-full py-4 bg-[#1A7F74] text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={18} /> اعتماد العمل وصرف {formatCurrency(task.payment)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
