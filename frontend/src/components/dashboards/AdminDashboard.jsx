import { Link } from 'react-router-dom';
import { Briefcase, Lock, CheckCircle, Wallet, ArrowLeft, Users } from 'lucide-react';

export default function AdminDashboard({ projects, totalBudget, totalLocked, totalPaid }) {
  // Admin sees all
  const totalUsers = 4; // Mock users (Admin, Client, Freelancer, Coordinator)

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">لوحة الإدارة الشاملة</h1>
          <p className="text-gray-500 font-medium">مراقبة جميع الأموال المحجوزة والمشاريع عبر منصة كفيل.</p>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between h-36">
          <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Users size={16}/> إجمالي المستخدمين</p>
          <p className="text-3xl font-black text-gray-900">{totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between h-36">
          <p className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2"><Briefcase size={16}/> إجمالي المشاريع</p>
          <p className="text-3xl font-black text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-blue-900 p-6 rounded-3xl shadow-[0_10px_30px_-10px_rgba(30,58,138,0.5)] flex flex-col justify-between h-36 transform scale-100 md:scale-105 z-10 transition-transform">
          <p className="text-xs font-bold text-blue-200 uppercase flex items-center gap-2"><Lock size={16}/> الخزنة (Escrow)</p>
          <p className="text-3xl font-black text-white">${totalLocked.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between h-36">
          <p className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-2"><CheckCircle size={16}/> المدفوعات المحررة</p>
          <p className="text-3xl font-black text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 px-1">جميع المشاريع النشطة على المنصة ({projects.length})</h2>
      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-400 font-bold text-lg">لا توجد مشاريع في المنصة حالياً.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="bg-white border border-gray-100 p-6 rounded-3xl hover:border-blue-200 hover:shadow-xl transition-all duration-300 group block">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-blue-900 transition truncate">{p.title}</h3>
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Lock size={12}/> كفيل
                </span>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-4">صاحب المشروع: {p.owner}</p>
              <div className="flex justify-between items-end pt-4 border-t border-gray-50">
                <div>
                  <span className="block text-xs font-bold text-gray-400 mb-1">الميزانية</span>
                  <p className="font-black text-2xl text-gray-900">${p.budget.toLocaleString()}</p>
                </div>
                <div className="text-blue-600 font-bold flex items-center gap-2 group-hover:-translate-x-1 transition-transform">
                  التفاصيل <ArrowLeft size={16}/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
