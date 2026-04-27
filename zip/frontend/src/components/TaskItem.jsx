import { CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TaskItem({ t, onApprove, userRole }) {
  const isUnfair = t.payment <= 200; // Demo logic trigger

  return (
    <div className={`p-5 border-2 rounded-2xl bg-white transition flex flex-col md:flex-row md:items-center justify-between gap-4 group ${(!t.paid && isUnfair) ? 'border-red-300 shadow-lg shadow-red-100/50' : 'border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-lg hover:border-blue-100'}`}>
      <div className="flex-1 relative">
        <h3 className="font-extrabold text-gray-900 text-xl mb-2 group-hover:text-blue-900 transition tracking-tight">{t.name}</h3>
        <p className="text-sm text-gray-500 font-medium">المُنفذ: <span className="bg-gray-100 px-2.5 py-1 rounded-md text-gray-800 border border-gray-200">{t.assignedTo}</span></p>
        
        {!t.paid && isUnfair && (
          <div className="mt-4 flex items-start gap-4 bg-red-50 text-red-800 p-5 rounded-xl border border-red-200 animate-pulse-soft shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-red-500"></div>
            <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-red-100/20 to-transparent pointer-events-none"></div>
            <div className="bg-red-100 p-2 rounded-full shrink-0 relative z-10"><AlertTriangle size={24} className="text-red-600 animate-bounce" /></div>
            <div className="relative z-10">
               <h4 className="font-black text-red-900 mb-1.5 text-[15px]">⚠ هذا المبلغ أقل من متوسط السوق</h4>
               <p className="text-sm font-bold leading-relaxed opacity-95">
                 المبلغ المخصص للمهمة (<span className="bg-red-200 px-1 py-0.5 rounded">${t.payment}</span>) يعادل <span className="underline decoration-red-400 underline-offset-4">جزءاً صغيراً جداً من متوسط السوق الإقليمية</span> (حوالي $900). نظام كفيل يطالب بالانصاف وعدم استغلال حاجة المستقل في هذا المشروع.
               </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/80 p-4 rounded-2xl border border-gray-100 shrink-0">
        <div className="text-center sm:text-right px-4">
          <span className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">قيمة الدفعة</span>
          <span className={`block text-3xl font-black ${(!t.paid && isUnfair) ? 'text-red-600' : 'text-gray-900'}`}>${t.payment}</span>
        </div>
        <div className="h-10 w-px bg-gray-200 hidden sm:block"></div>
        <div className="w-full sm:w-auto flex flex-col gap-2">
          {t.paid ? (
            <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:min-w-[160px] shadow-sm">
              <CheckCircle size={20}/> تم التحرير
            </span>
          ) : userRole === 'client' || userRole === 'admin' ? (
            <>
              <button 
                onClick={() => onApprove(t.id)} 
                className="bg-gray-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all w-full sm:min-w-[160px] shadow-md shadow-gray-900/20 flex items-center justify-center gap-2"
              >
                <CheckCircle size={18}/> اعتماد الدفعة
              </button>
              <Link 
                to={`/dispute/${t.id}`}
                className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-4 decoration-red-200 hover:decoration-red-400 transition"
              >
                <AlertTriangle size={14}/> رفع شكوى / منازعة (مجاناً)
              </Link>
            </>
          ) : (
            <>
              <span className="bg-blue-50 border border-blue-200 text-blue-700 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:min-w-[160px] shadow-sm">
                <Lock size={18}/> قيد الحجز بالضمان
              </span>
              <Link 
                to={`/dispute/${t.id}`}
                className="flex items-center justify-center gap-1 text-xs font-bold text-red-500 hover:text-red-600 underline underline-offset-4 decoration-red-200 hover:decoration-red-400 transition mt-2"
              >
                <AlertTriangle size={14}/> رفع شكوى / منازعة (مجاناً)
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
