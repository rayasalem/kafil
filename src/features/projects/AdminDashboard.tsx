import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Lock, CheckCircle, Shield, TrendingUp, Users,
  AlertOctagon, Scale, Eye, Activity, Database, ChevronRight, Globe
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, User } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';
import { useLanguage } from '@/shared/context/LanguageContext';
import { translations } from '@/shared/translations';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { lang, isRtl } = useLanguage();
  const tFull = translations.dashboard[lang];
  const tAdmin = tFull.admin;
  const tCommon = tFull.common;
  const tStatus = tFull.status;

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'projects' | 'users'>('projects');

  useEffect(() => {
    Promise.all([
      api.getProjects(),
      api.getUsers()
    ]).then(([projectsData, usersData]) => {
      setProjects(projectsData);
      setUsers(usersData);
      setLoading(false);
    });
  }, []);

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalPaid = projects.reduce((sum, p) => sum + (p.tasks || []).filter(t => t.paid).reduce((s, t) => s + (t.payment || 0), 0), 0);
  const totalLocked = totalBudget - totalPaid;

  const totalDisputes = projects.reduce((sum, p) => sum + (p.tasks || []).filter(t => t.status === 'Disputed').length, 0);

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
    <div className="animate-fade-in max-w-6xl mx-auto space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-2">{tAdmin.title}</h1>
          <p className="text-gray-500 font-medium">{tAdmin.subtitle}</p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-[#E8DDD0] px-4 py-2.5 rounded-2xl shadow-sm">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-sm font-bold text-[#0D1B2A]">{tAdmin.systemStatus}</span>
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
              {tAdmin.treasury}
            </span>
          </div>
          <p className="text-4xl font-black text-white tracking-tight mb-1 relative z-10">{formatCurrency(totalLocked)}</p>
          <p className="text-sm font-bold text-white/50 relative z-10">{lang === 'ar' ? 'أموال Escrow نشطة' : 'Active Escrow funds'}</p>
        </div>

        {/* Platform Revenue */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#C9A84C]/30 hover:shadow-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              {lang === 'ar' ? '+12% عمولة' : '+12% commission'}
            </span>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">{formatCurrency(platformRevenue)}</p>
            <p className="text-sm font-bold text-gray-400">{tAdmin.platformRevenue}</p>
          </div>
        </div>

        {/* Disputes Alert */}
        <div className="bg-white p-6 rounded-3xl border border-[#E8DDD0] shadow-sm flex flex-col justify-between relative overflow-hidden transition-all hover:border-red-200 hover:shadow-lg">
          <div className="absolute right-0 top-0 h-full w-1.5 bg-red-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 rounded-xl bg-red-50 text-red-600 border border-red-100">
              <Scale size={24} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">{totalDisputes}</p>
            <p className="text-sm font-bold text-gray-400">{tAdmin.activeDisputes}</p>
          </div>
        </div>

        {/* Users */}
        <button 
          onClick={() => setView('users')}
          className={cn(
            "p-6 rounded-3xl border transition-all text-right group relative overflow-hidden",
            isRtl ? "text-right" : "text-left",
            view === 'users' 
              ? "bg-[#C9A84C] border-[#C9A84C] shadow-lg shadow-[#C9A84C]/20" 
              : "bg-white border-[#E8DDD0] shadow-sm hover:border-[#C9A84C]/30 hover:shadow-lg"
          )}
        >
          <div className="flex justify-between items-start mb-4">
            <div className={cn(
              "p-3 rounded-xl border transition-colors",
              view === 'users' ? "bg-white/20 text-white border-white/20" : "bg-blue-50 text-blue-600 border-blue-100"
            )}>
              <Users size={24} />
            </div>
            {view !== 'users' && <ChevronRight size={20} className={cn("text-gray-300 group-hover:text-[#C9A84C] transition-colors", isRtl ? "" : "rotate-180")} />}
          </div>
          <div>
            <p className={cn("text-3xl font-black tracking-tight mb-1", view === 'users' ? "text-white" : "text-[#0D1B2A]")}>
              {users.length}
            </p>
            <p className={cn("text-sm font-bold", view === 'users' ? "text-white/80" : "text-gray-400")}>{tAdmin.totalUsers}</p>
          </div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#E8DDD0] rounded-2xl w-fit">
        <button 
          onClick={() => setView('projects')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            view === 'projects' ? "bg-[#0D1B2A] text-white shadow-md" : "text-gray-500 hover:bg-gray-50 text-gray-400"
          )}
        >
          {tAdmin.projectsTab}
        </button>
        <button 
          onClick={() => setView('users')}
          className={cn(
            "px-6 py-2.5 rounded-xl text-sm font-black transition-all",
            view === 'users' ? "bg-[#0D1B2A] text-white shadow-md" : "text-gray-500 hover:bg-gray-50 text-gray-400"
          )}
        >
          {tAdmin.usersTab}
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {view === 'projects' ? (
            <div className={cn("space-y-5", isRtl ? "text-right" : "text-left")}>
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2">
                  <Activity size={20} className="text-[#C9A84C]" /> {tAdmin.financialActivity}
                </h2>
                <span className="text-sm font-bold text-gray-400">({projects.length} {lang === 'ar' ? 'مشاريع' : 'projects'})</span>
              </div>

              {projects.length === 0 ? (
                <div className="bg-white border-2 border-dashed border-[#E8DDD0] rounded-3xl p-16 text-center shadow-sm">
                  <p className="text-gray-400 font-bold text-lg">{lang === 'ar' ? 'لا توجد مشاريع مسجلة.' : 'No registered projects.'}</p>
                </div>
              ) : (
                <div className="bg-white border border-[#E8DDD0] rounded-[2rem] shadow-sm overflow-hidden text-right">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50/80 border-b border-[#E8DDD0]">
                      <tr className={cn(isRtl ? "text-right" : "text-left")}>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'المشروع / العميل' : 'Project / Client'}</th>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'الميزانية' : 'Budget'}</th>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'الخزنة (Escrow)' : 'Vault (Escrow)'}</th>
                        <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
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
                            <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                              <p className="font-bold text-[#0D1B2A] text-sm mb-1">{p.title}</p>
                              <p className="text-xs text-gray-400 font-medium">{p.owner}</p>
                            </td>
                            <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                              <p className="text-sm font-black text-[#0D1B2A]">{formatCurrency(p.budget)}</p>
                            </td>
                            <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                              <p className="text-sm font-black text-[#C9A84C] flex items-center gap-1.5">
                                <Lock size={12} /> {formatCurrency(projEscrow)}
                              </p>
                            </td>
                            <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                              {hasDispute ? (
                                <span className="bg-red-50 text-red-600 border border-red-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                                  <AlertOctagon size={12}/> {lang === 'ar' ? 'نزاع قائم' : 'Open Dispute'}
                                </span>
                              ) : projEscrow === 0 ? (
                                <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                                  <CheckCircle size={12}/> {tStatus.Completed}
                                </span>
                              ) : (
                                <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-1 rounded-md text-[10px] font-black flex items-center gap-1 w-fit">
                                  <Activity size={12}/> {tStatus.Active}
                                </span>
                              )}
                            </td>
                            <td className="p-5 text-left">
                              <Link to={`/projects/${p.id}`} className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 border border-[#E8DDD0] text-gray-500 hover:bg-[#0D1B2A] hover:text-[#C9A84C] hover:border-[#0D1B2A] transition-all">
                                {isRtl ? <ArrowLeft size={16} /> : <ChevronRight size={16} />}
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
          ) : (
            <div className={cn("space-y-5 font-sans", isRtl ? "text-right" : "text-left")}>
              <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-bold text-[#0D1B2A] flex items-center gap-2 font-sans">
                  <Users size={20} className="text-[#C9A84C]" /> {tAdmin.usersList}
                </h2>
                <span className="text-sm font-bold text-gray-400">({users.length} {lang === 'ar' ? 'مستخدم' : 'users'})</span>
              </div>

              <div className="bg-white border border-[#E8DDD0] rounded-[2rem] shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-50/80 border-b border-[#E8DDD0]">
                    <tr className={cn(isRtl ? "text-right" : "text-left")}>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'المستخدم' : 'User'}</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">{lang === 'ar' ? 'الرتبة' : 'Role'}</th>
                      <th className="p-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                      <th className="p-5 w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8DDD0]/50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] text-[#C9A84C] flex items-center justify-center font-black text-sm shrink-0">
                              {(u.name?.[0] || u.username?.[0] || '?').toUpperCase()}
                            </div>
                            <div className={cn(isRtl ? "text-right" : "text-left")}>
                              <p className="font-bold text-[#0D1B2A] text-sm mb-0.5">{u.name || (lang === 'ar' ? 'مستخدم جديد' : 'New User')}</p>
                              <p className="text-[10px] text-gray-400 font-medium">@{u.username || u.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                          <p className="text-sm font-bold text-gray-600">{u.email}</p>
                        </td>
                        <td className="p-5 text-center">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest inline-block min-w-[70px]",
                            u.role === 'admin' ? "bg-red-50 text-red-600 border border-red-100" :
                            u.role === 'client' ? "bg-blue-50 text-blue-600 border border-blue-100" : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          )}>
                             {u.role === 'admin' ? (lang === 'ar' ? 'مدير' : 'Admin') : 
                              u.role === 'client' ? (lang === 'ar' ? 'عميل' : 'Client') : 
                              u.role === 'freelancer' ? (lang === 'ar' ? 'مستقل' : 'Freelancer') : u.role}
                          </span>
                        </td>
                        <td className={cn("p-5", isRtl ? "text-right" : "text-left")}>
                          <p className="text-sm font-bold text-gray-400">{u.joinedAt}</p>
                        </td>
                        <td className="p-5 text-left">
                          <button 
                            onClick={() => {
                              api.setCurrentUser(u);
                              toast.success(lang === 'ar' ? `جاري الانتقال إلى لوحة ${u.name}` : `Switching to ${u.name}'s dashboard`);
                              setTimeout(() => {
                                window.location.href = u.role === 'client' ? '/dashboard/client' : u.role === 'freelancer' ? '/dashboard/freelancer' : '/dashboard/admin';
                              }, 1000);
                            }} 
                            className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-gray-50 border border-[#E8DDD0] text-gray-500 hover:bg-[#0D1B2A] hover:text-[#C9A84C] hover:border-[#0D1B2A] transition-all"
                            title={lang === 'ar' ? 'عرض لوحة التحكم' : 'View Dashboard'}
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions & System Log */}
        <div className="space-y-6">
          <div className="bg-[#0D1B2A] rounded-3xl p-6 border border-white/10 shadow-xl relative overflow-hidden">
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#C9A84C] rounded-full blur-[40px] opacity-20 pointer-events-none"></div>
            <h3 className={cn("text-sm font-black text-[#C9A84C] uppercase tracking-widest mb-6 border-b border-white/10 pb-4", isRtl ? "text-right" : "text-left")}>
              {tAdmin.quickActions}
            </h3>
            <div className="space-y-3 relative z-10">
              <Link to="/disputes" className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
                    <Scale size={18} />
                  </div>
                  <span className="font-bold text-sm">{tAdmin.reviewDisputes}</span>
                </div>
                {isRtl ? <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors rotate-180" /> : <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />}
              </Link>
              <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-white group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <span className="font-bold text-sm">{tAdmin.securitySettings}</span>
                </div>
                {isRtl ? <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors rotate-180" /> : <ChevronRight size={16} className="text-white/30 group-hover:text-white transition-colors" />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-[#E8DDD0] shadow-sm p-6">
            <h3 className={cn("text-sm font-black text-gray-400 uppercase tracking-widest mb-6 border-b border-[#E8DDD0] pb-4", isRtl ? "text-right" : "text-left")}>
              {tAdmin.platformLog}
            </h3>
            <div className="space-y-5">
              {[
                { 
                  time: lang === 'ar' ? 'منذ ساعتين' : '2 hours ago', 
                  action: lang === 'ar' ? 'صرف دفعة' : 'Payment Disbursed', 
                  desc: lang === 'ar' ? 'تم تحويل $1,000 للمستقل (عمر ف.)' : 'Transferred $1,000 to freelancer (Omar F.)' 
                },
                { 
                  time: lang === 'ar' ? 'منذ 5 ساعات' : '5 hours ago', 
                  action: lang === 'ar' ? 'فتح نزاع' : 'Dispute Opened', 
                  desc: lang === 'ar' ? 'نزاع جديد في مشروع "تطبيق متجر إلكتروني"' : 'New dispute in "Ecommerce App" project', 
                  isRed: true 
                },
                { 
                  time: lang === 'ar' ? 'أمس' : 'Yesterday', 
                  action: lang === 'ar' ? 'إيداع جديد' : 'New Deposit', 
                  desc: lang === 'ar' ? 'تم حجز $4,500 في الخزنة' : '$4,500 held in Escrow' 
                },
              ].map((log, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: log.isRed ? '#EF4444' : '#C9A84C' }}></div>
                  <div className={cn(isRtl ? "text-right" : "text-left")}>
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
