import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle, Briefcase, Wallet } from 'lucide-react';
import { api } from '../../services/api';
import { Project } from '@/types';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    api.getProjects().then(data => {
         setProjects(data);
      });
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0), 0);
  const totalLocked = totalBudget - totalPaid;

  const totalUsers = 4; // Mock for now: Admin, Sara, Omar, Lina... wait 5 including the client. Let's make it fixed demo number or count distinct users.
  // just demo mock users
  const activeUsers = 12;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">لوحة الإدارة الشاملة (Admin)</h1>
          <p className="text-gray-500 font-medium">مراقبة جميع الأموال المحجوزة والمشاريع والمستخدمين عبر منصة كفيل.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-12">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">إجمالي المستخدمين</p>
          <p className="text-3xl font-black text-gray-900">{activeUsers}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
          <p className="text-sm font-bold text-gray-400 uppercase mb-2">إجمالي المشاريع</p>
          <p className="text-3xl font-black text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-blue-900 p-6 rounded-3xl shadow-[0_10px_30px_-10px_rgba(30,58,138,0.5)] flex flex-col justify-between relative overflow-hidden transform scale-100 md:scale-105 z-10 transition-transform">
          <div className="absolute right-0 top-0 w-32 h-32 bg-blue-800 rounded-full blur-2xl -z-10 opacity-50"></div>
          <p className="text-sm font-bold text-blue-200 uppercase mb-2 flex items-center gap-1"><Lock size={14}/> أموال Escrow</p>
          <p className="text-3xl font-black text-white">${totalLocked.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-emerald-500"></div>
          <p className="text-sm font-bold text-gray-400 uppercase mb-2 flex items-center gap-1"><CheckCircle size={14} className="text-emerald-500"/> المدفوعات المسلمة</p>
          <p className="text-3xl font-black text-gray-900">${totalPaid.toLocaleString()}</p>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6 px-1">جميع المشاريع على المنصة ({projects.length})</h2>
      {projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-16 text-center shadow-sm">
          <p className="text-gray-400 font-bold text-lg">لا توجد مشاريع في المنصة.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-5">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="bg-white border border-gray-100 p-6 rounded-3xl hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 group block relative overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900 group-hover:text-blue-900 transition truncate pl-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 font-medium">العميل: {p.owner}</p>
                </div>
                <span className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm">
                  <Lock size={12}/> كفيل
                </span>
              </div>
              
              <div className="mb-6 relative z-10">
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner flex">
                  <div className="bg-emerald-500 h-full transition-all duration-1000 w-1/4" style={{width: `${p.tasks.length ? (p.tasks.filter(t=>t.paid).length/p.tasks.length)*100 : 0}%`}}></div>
                </div>
              </div>

              <div className="flex justify-between items-end relative z-10 pt-2 border-t border-gray-50">
                <div>
                  <span className="block text-xs font-bold text-gray-400 mb-1">الميزانية الكلية</span>
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
