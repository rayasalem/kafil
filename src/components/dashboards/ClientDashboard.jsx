import { Link } from 'react-router-dom';
import { Briefcase, Lock, CheckCircle, Wallet, ArrowLeft, ChevronLeft } from 'lucide-react';
import DemoButton from '../DemoButton.jsx';

export default function ClientDashboard({ projects, totalBudget, totalLocked, totalPaid }) {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">الخزنة المركزية (Client)</h1>
          <p className="text-gray-500 font-medium">تابع استثماراتك المالية في مشاريعك بأقصى درجات الأمان.</p>
        </div>
        <div className="flex gap-3">
          <div className="w-56 hidden md:block">
            <DemoButton />
          </div>
          <Link to="/create" className="bg-blue-900 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-blue-800 transition shadow-lg shadow-blue-900/20 flex items-center gap-2">
            إطلاق مشروع جديد <ChevronLeft size={18}/>
          </Link>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid md:grid-cols-3 gap-5 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between h-36 relative overflow-hidden">
          <div className="absolute left-0 top-0 h-full w-1 border-l-4 border-gray-100"></div>
          <p className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2"><Briefcase size={16}/> إجمالي الميزانيات المُصدرة</p>
          <p className="text-4xl font-black text-gray-900">${totalBudget.toLocaleString()}</p>
        </div>
        <div className="bg-blue-900 p-6 rounded-3xl shadow-[0_10px_30px_-10px_rgba(30,58,138,0.5)] flex flex-col justify-between h-36 relative overflow-hidden transform scale-100 md:scale-105 z-10 transition-transform">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-800 rounded-full blur-2xl -z-10 opacity-50"></div>
          <p className="text-sm font-bold text-blue-200 uppercase flex items-center gap-2"><Lock size={16}/> أموال الخزنة (Escrow)</p>
          <p className="text-4xl font-black text-white">${totalLocked.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between h-36 relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-emerald-500"></div>
          <p className="text-sm font-bold text-gray-400 uppercase flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500"/> المدفوعات المحررة</p>
          <p className="text-4xl font-black text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      {/* VISUALIZATION FLOW */}
      <div className="mb-12 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
         <h2 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2"><Wallet className="text-blue-600"/> تدفق مسار المدفوعات</h2>
         <div className="flex flex-col md:flex-row items-center justify-between max-w-3xl mx-auto relative gap-4">
            <div className="hidden md:block absolute top-1/2 left-8 right-8 h-1 bg-gray-100 -z-10 mt-[-2px]"></div>
            <div className="bg-gray-50 border border-gray-200 w-32 p-4 rounded-2xl text-center z-10">
              <span className="block text-xl font-black text-gray-900 mb-1">${totalBudget}</span>
              <span className="text-xs font-bold text-gray-500">رأس المال</span>
            </div>
            <ArrowLeft className="text-gray-300 hidden md:block" size={24}/>
            <div className="bg-blue-50 border-2 border-blue-200 w-40 p-4 rounded-2xl text-center shadow-lg shadow-blue-100 z-10 transform scale-105">
              <span className="block text-2xl font-black text-blue-800 mb-1">${totalLocked}</span>
              <span className="text-xs font-bold text-blue-600 flex items-center justify-center gap-1"><Lock size={12}/> قيد الاحتجاز</span>
            </div>
            <ArrowLeft className="text-gray-300 hidden md:block" size={24}/>
            <div className="bg-emerald-50 border border-emerald-200 w-32 p-4 rounded-2xl text-center z-10">
              <span className="block text-xl font-black text-emerald-800 mb-1">${totalPaid}</span>
              <span className="text-xs font-bold text-emerald-600">مصروفة</span>
            </div>
         </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 px-1">مشاريعك قيد التنفيذ ({projects.length})</h2>
      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-400 mb-4 font-bold text-lg">لم تقم بإيداع ميزانية لأي مشروع بعد.</p>
          <div className="flex flex-col items-center gap-4">
             <Link to="/create" className="text-blue-600 font-bold hover:text-blue-800 transition border-b-2 border-blue-200 hover:border-blue-600 pb-1">ابدأ بتمويل مشروعك الأول</Link>
             <div className="w-64 mt-4 md:hidden">
               <DemoButton />
             </div>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="bg-white border border-gray-100 p-6 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group block relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-blue-900 transition truncate pl-2">{p.title}</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm">
                  <Lock size={12}/> كفيل يحمي الدفعات
                </span>
              </div>
              
              <div className="mb-6 relative z-10">
                <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                  <span>الميزانية المرصودة</span>
                  <span className="text-emerald-600">أُنجِز {p.tasks.filter(t=>t.paid).length} من {p.tasks.length} مهام</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner flex">
                  <div className="bg-emerald-500 h-full transition-all duration-1000 w-1/4" style={{width: `${p.tasks.length ? (p.tasks.filter(t=>t.paid).length/p.tasks.length)*100 : 0}%`}}></div>
                </div>
              </div>

              <div className="flex justify-between items-end relative z-10 pt-2 border-t border-gray-50">
                <div>
                  <span className="block text-xs font-bold text-gray-400 mb-1">الميزانية</span>
                  <p className="font-black text-2xl text-gray-900">${p.budget.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                  <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
