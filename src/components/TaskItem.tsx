import { FC } from 'react';
import { ShieldCheck, User, ArrowLeft, TriangleAlert, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Task, UserRole } from '../types';

interface TaskItemProps {
  t: Task;
  onApprove: (id: string) => void;
  userRole: UserRole;
}

const TaskItem: FC<TaskItemProps> = ({ t, onApprove, userRole }) => {
  const isPaid = t.paid;
  const isPending = t.status === 'Pending';
  const isProgress = t.status === 'In Progress';
  const isDisputed = t.status === 'Disputed';

  return (
    <div className={`group relative bg-white border ${isPaid ? 'border-emerald-100 bg-emerald-50/20' : 'border-gray-100'} p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-lg hover:shadow-gray-100/50`}>
      {isPaid && <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">تم الدفع بنجاح</div>}
      
      <div className="flex items-start gap-4 flex-1">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
          {isPaid ? <CheckCircle2 size={24}/> : <ShieldCheck size={24}/>}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-lg mb-1 leading-tight">{t.name}</h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            <span className="text-gray-400 flex items-center gap-1.5 font-medium"><User size={14} className="text-gray-300"/> {t.assignedTo}</span>
            <span className={`flex items-center gap-1.5 font-bold ${isPaid ? 'text-emerald-600' : isDisputed ? 'text-red-600' : 'text-amber-600'}`}>
               <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
               {isPaid ? 'مكتمل' : isDisputed ? 'نزاع مفتوح' : isProgress ? 'قيد التنفيذ' : 'انتظار الاعتماد'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
        <div className="text-left">
          <span className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">مبلغ المهمة</span>
          <span className="text-xl font-black text-gray-900 leading-none">${t.payment.toLocaleString()}</span>
        </div>
        
        <div className="flex gap-2 mr-auto md:mr-0">
          {!isPaid && (userRole === 'client' || userRole === 'admin') && (
            <button 
              onClick={() => onApprove(t.id)}
              className="bg-emerald-600 text-white font-bold px-5 py-2.5 rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20 text-sm whitespace-nowrap"
            >
              اعتماد وصرف <ArrowLeft size={16}/>
            </button>
          )}
          {!isPaid && (userRole === 'freelancer' || userRole === 'admin') && (
             <Link 
                to={`/dispute/${t.id}`}
                className="bg-white text-red-600 border border-red-100 font-bold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2 text-sm"
             >
                <TriangleAlert size={16}/> فتح نزاع
             </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
