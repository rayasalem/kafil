import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Lock, CheckCircle, Shield, TrendingUp, Users,
  AlertOctagon, Scale, Eye, Activity, Database
} from 'lucide-react';
import { api } from '@/services/api';
import { Project } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalPaid = projects.reduce((sum, p) => sum + p.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0), 0);
  const totalLocked = totalBudget - totalPaid;

  const totalDisputes = projects.reduce((sum, p) => sum + p.tasks.filter(t => t.status === 'Disputed').length, 0);

  // Mock Admin Stats
  const platformRevenue = totalPaid * 0.12; // Assuming 12% platform fee
  const activeUsers = 124;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#E8DDD0] border-t-[#C9A84C] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-2">لوحة التحكم المركزية (Admin)</h1>
          <p className="text-gray-500 font-medium">مراقبة السيولة المالية، النزاعات، ونشاط المستخدمين في منصة كفيل.</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#E8DDD0] px-4 py-2.5 rounded-2xl shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-[#0D1B2A]">النظام مستقر</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Treasury Card - Premium Focus */}
        <div className="bg-[#0D1B2A] p-6 rounded-3xl shadow-2xl relative overflow-hidden transform transition-transform hover:-translate-y-1 border border-[#0D1B2A]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#C9A84C] rounded-full blur-[50px] opacity-20 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#C9A84C]">
              <Database size={24} />
            </div>
            <span className="text-[10px] font-black text-[#C9A84C] bg-[#C9A84C]/10 px-2 py-1 rounded-md border border-[#C9A84C]/20 uppercase tracking-widest">
              خزينة كفيل
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-tight mb-1 relative z-10">{formatCurrency(totalLocked)}</p>
          <p className="text-sm font-bold text-white/50 relative z-10">أموال Escrow نشطة</p>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#C9A84C]/30 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              +12% عمولة
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">{formatCurrency(platformRevenue)}</p>
            <p className="text-sm font-bold text-gray-400">أرباح المنصة المكتسبة</p>
          </div>
        </div>

        {/* Disputes Alert */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:border-red-200 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-red-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Scale size={24} />
            </div>
            {totalDisputes > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md animate-pulse">
                تحتاج تدخل
              </span>
            )}
          </div>
          <div>
            <p className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">{totalDisputes}</p>
            <p className="text-sm font-bold text-gray-400">نزاعات نشطة</p>
          </div>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#C9A84C]/30 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users size={24} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">{activeUsers}</p>
            <p className="text-sm font-bold text-gray-400">مستخدمين نشطين</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Projects Table */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
              <Activity size={20} className="text-[#C9A84C]" /> النشاط المالي للمشاريع
            </h2>
            <span className="text-sm font-bold text-gray-400">({projects.length} مشاريع)</span>
          </div>

          {projects.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-[#E8DDD0] rounded-3xl p-16 text-center shadow-sm">
              <p className="text-gray-400 font-bold text-lg">لا توجد مشاريع مسجلة.</p>
            </div>
          ) : (
            <div className="bg-white border border-[#E8DDD0] rounded-[2rem] shadow-sm overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead className="bg-gray-50/80 border-b border-[#E8DDD0]">
                  <tr>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">المشروع / العميل</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الميزانية</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الخزنة (Escrow)</th>
                    <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                    <th className="p-5 w-16"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8DDD0]/50">
                  {projects.map(p => {
                    const projPaid = p.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0);
                    const projEscrow = p.budget - projPaid;
                    const hasDispute = p.tasks.some(t => t.status === 'Disputed');
                    
                    return (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-5">
                          <p className="font-bold text-[#0D1B2A] text-sm mb-1">{p.title}</p>
                          <p className="text-xs text-gray-400 font-medium">{p.owner}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-black text-[#0D1B2A]">{formatCurrency(p.budget)}</p>
                        </td>
                        <td className="p-5">
                          <p className="text-sm font-black text-[#C9A84C] flex items-center gap-1.5">
                            <Lock size={12} /> {formatCurrency(projEscrow)}
                          </p>
                        </td>
                        <td className="p-5">
                          {hasDispute ? (
                            <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                              <AlertOctagon size={12}/> نزاع قائم
                            </span>
                          ) : projEscrow === 0 ? (
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                              <CheckCircle size={12}/> مكتمل
                            </span>
                          ) : (
                            <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                              <Activity size={12}/> نشط
                            </span>
                          )}
                        </td>
                        <td className="p-5 text-left">
                          <Link to={`/projects/${p.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 border border-[#E8DDD0] text-gray-500 hover:bg-[#0D1B2A] hover:text-[#C9A84C] hover:border-[#0D1B2A] transition-all">
                            <ArrowLeft size={16} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions & System Log */}
        <div className="space-y-6">
          <div className="bg-[#0D1B2A] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#C9A84C] rounded-full blur-[40px] opacity-20 pointer-events-none"></div>
            <h3 className="text-sm font-black text-[#C9A84C] uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
              إجراءات سريعة
            </h3>
            <div className="space-y-3 relative z-10">
              <Link to="/disputes" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                    <Scale size={18} />
                  </div>
                  <span className="font-bold text-sm">مراجعة النزاعات</span>
                </div>
                <ArrowLeft size={16} className="text-white/30 group-hover:text-white transition-colors" />
              </Link>
              <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <span className="font-bold text-sm">إعدادات الحماية</span>
                </div>
                <ArrowLeft size={16} className="text-white/30 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-[#E8DDD0] shadow-sm p-6">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-[#E8DDD0] pb-4">
              سجل نشاط المنصة
            </h3>
            <div className="space-y-5">
              {[
                { time: 'منذ ساعتين', action: 'صرف دفعة', desc: 'تم تحويل $1,000 للمستقل (عمر ف.)' },
                { time: 'منذ 5 ساعات', action: 'فتح نزاع', desc: 'نزاع جديد في مشروع "تطبيق متجر إلكتروني"', isRed: true },
                { time: 'أمس', action: 'إيداع جديد', desc: 'تم حجز $4,500 في الخزنة' },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: log.isRed ? '#EF4444' : '#C9A84C' }}></div>
                  <div>
                    <p className="text-sm font-bold text-[#0D1B2A] mb-0.5">{log.action}</p>
                    <p className="text-xs text-gray-500 mb-1">{log.desc}</p>
                    <p className="text-[10px] font-black text-gray-300">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
