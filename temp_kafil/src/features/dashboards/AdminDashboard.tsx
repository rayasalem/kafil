import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, Lock, Scale, BarChart3, 
  Bell, Globe, UserCircle2, ArrowUpRight, ArrowDownRight, 
  ShieldCheck, ArrowRightLeft, CheckCircle2,
  TrendingUp, CircleDollarSign, LogOut, Activity, AlertOctagon,
  MoreVertical, ChevronRight, Eye, Edit, CheckCircle, Search, Filter
} from 'lucide-react';
import { cn } from '../../lib/cn.js';

const INITIAL_MOCK_DATA = {
  stats: {
    users: 34,
    projects: 12,
    escrow: 50000,
    released: 124500
  },
  projects: [
    { id: 'PRJ-882', name: 'Fintech Mobile App', client: 'Ahmed S.', budget: 12000, progress: 65, status: 'Active' },
    { id: 'PRJ-883', name: 'Web Portal Design', client: 'Sara M.', budget: 4500, progress: 100, status: 'Completed' },
    { id: 'PRJ-884', name: 'Payment Gateway', client: 'Tariq A.', budget: 8200, progress: 30, status: 'Dispute' },
    { id: 'PRJ-885', name: 'Brand Identity', client: 'Lina K.', budget: 1500, progress: 80, status: 'Active' }
  ],
  users: [
    { id: 'USR-01', name: 'Omar F.', role: 'Admin', status: 'Active', activity: 'Online' },
    { id: 'USR-02', name: 'Tariq A.', role: 'Client', status: 'Active', activity: '2h ago' },
    { id: 'USR-03', name: 'Ziad H.', role: 'Freelancer', status: 'Active', activity: 'Online' },
    { id: 'USR-04', name: 'Nour E.', role: 'Coordinator', status: 'Inactive', activity: '5d ago' }
  ],
  disputes: [
    { id: '#DSP-11', taskId: 'TASK-11', participants: 'Tariq A. vs Ziad', status: 'Pending', decision: '-' },
    { id: '#DSP-08', taskId: 'TASK-08', participants: 'Rami M. vs Yasser', status: 'Voting', decision: '-' },
    { id: '#DSP-04', taskId: 'TASK-04', participants: 'Sara M. vs Huda', status: 'Resolved', decision: 'Refund 100%' }
  ],
  revenue: [
    { month: 'Jan', value: 4000 },
    { month: 'Feb', value: 6500 },
    { month: 'Mar', value: 8000 },
    { month: 'Apr', value: 12000 },
    { month: 'May', value: 15500 },
    { month: 'Jun', value: 21000 },
  ]
};

const DICT = {
  en: {
    title: "System Control",
    dashboard: "Dashboard Overview",
    projects: "Projects",
    users: "Users",
    escrow: "Escrow Manager",
    disputes: "Disputes Center",
    analytics: "Analytics",
    logout: "Logout",
    stats: {
      users: "Total Users",
      projects: "Total Projects",
      escrow: "Total Escrow Funds",
      released: "Payments Released",
    },
    escrowPanel: {
      title: "Escrow Control Panel",
      desc: "Real-time fund allocation and platform treasury flow.",
      locked: "Total Locked Funds",
      released: "Total Released Funds",
      pending: "Pending Escrow",
      client: "Client Deposits",
      platform: "Secure Escrow",
      freelancer: "Freelancer Payout"
    },
    projectsTbl: {
      title: "Projects Overview",
      colName: "Project Name",
      colClient: "Client Name",
      colBudget: "Budget",
      colProgress: "Progress",
      colStatus: "Status",
      colActions: "Actions"
    },
    usersMgt: {
      title: "Platform Users",
      colName: "Name",
      colRole: "Role",
      colStatus: "Status",
      colActivity: "Activity",
      colActions: "Actions"
    },
    disputesCenter: {
      title: "Disputes Center",
      colCase: "Case ID",
      colParticipants: "Participants",
      colStatus: "Status",
      colDecision: "Decision",
      colActions: "Actions"
    },
    chart: {
      title: "Escrow Volume Trends"
    },
    status: {
      Active: "Active",
      Completed: "Completed",
      Dispute: "Dispute",
      Pending: "Pending",
      Voting: "Voting",
      Resolved: "Resolved",
      Inactive: "Inactive"
    },
    actions: {
      view: "View",
      edit: "Edit",
      resolve: "Resolve",
      activate: "Toggle Status"
    }
  },
  ar: {
    title: "إدارة النظام",
    dashboard: "نظرة عامة",
    projects: "المشاريع",
    users: "المستخدمين",
    escrow: "الخزنة (Escrow)",
    disputes: "مركز النزاعات",
    analytics: "التحليلات",
    logout: "تسجيل الخروج",
    stats: {
      users: "إجمالي المستخدمين",
      projects: "إجمالي المشاريع",
      escrow: "أموال الخزنة المحجوزة",
      released: "المدفوعات المسلمة",
    },
    escrowPanel: {
      title: "لوحة تحكم الخزنة المركزية",
      desc: "مراقبة تدفق الأموال وحالة الأمان في الوقت الفعلي.",
      locked: "الأموال المحجوزة حالياً",
      released: "إجمالي الأموال المسلمة",
      pending: "عمليات معلقة",
      client: "إيداع العميل",
      platform: "حماية كفيل",
      freelancer: "مستحقات المستقل"
    },
    projectsTbl: {
      title: "نظرة عامة على المشاريع",
      colName: "اسم المشروع",
      colClient: "العميل",
      colBudget: "الميزانية",
      colProgress: "الإنجاز",
      colStatus: "الحالة",
      colActions: "إجراءات"
    },
    usersMgt: {
      title: "مستخدمي المنصة",
      colName: "الاسم",
      colRole: "الصلاحية",
      colStatus: "الحالة",
      colActivity: "النشاط",
      colActions: "إجراءات"
    },
    disputesCenter: {
      title: "مركز النزاعات",
      colCase: "رقم القضية",
      colParticipants: "الأطراف",
      colStatus: "الحالة",
      colDecision: "القرار",
      colActions: "إجراءات"
    },
    chart: {
      title: "مؤشرات نمو الخزنة"
    },
    status: {
      Active: "نشط",
      Completed: "مكتمل",
      Dispute: "نزاع",
      Pending: "قيد الانتظار",
      Voting: "تصويت",
      Resolved: "محلول",
      Inactive: "غير نشط"
    },
    actions: {
      view: "عرض",
      edit: "تعديل",
      resolve: "حسم النزاع",
      activate: "تغيير الحالة"
    }
  }
};

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

const getStatusColor = (status) => {
  switch (status) {
    case 'Active': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Completed': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'Dispute': return 'bg-red-100 text-red-700 border-red-200';
    case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Voting': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'Resolved': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'Inactive': return 'bg-gray-100 text-gray-500 border-gray-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function AdminDashboard() {
  const [lang, setLang] = useState('en');
  const navigate = useNavigate();
  const location = useLocation();
  
  const [data, setData] = useState(INITIAL_MOCK_DATA);
  
  const d = DICT[lang];
  const isRtl = lang === 'ar';

  const currentPath = location.pathname;
  let activeTab = 'dashboard';
  if (currentPath.includes('/projects')) activeTab = 'projects';
  else if (currentPath.includes('/users')) activeTab = 'users';
  else if (currentPath.includes('/escrow')) activeTab = 'escrow';
  else if (currentPath.includes('/disputes')) activeTab = 'disputes';
  else if (currentPath.includes('/analytics')) activeTab = 'analytics';

  const navItems = [
    { id: 'dashboard', path: '/dashboard/admin', icon: LayoutDashboard, label: d.dashboard },
    { id: 'projects', path: '/dashboard/admin/projects', icon: Briefcase, label: d.projects },
    { id: 'users', path: '/dashboard/admin/users', icon: Users, label: d.users },
    { id: 'escrow', path: '/dashboard/admin/escrow', icon: Lock, label: d.escrow },
    { id: 'disputes', path: '/dashboard/admin/disputes', icon: Scale, label: d.disputes },
    { id: 'analytics', path: '/dashboard/admin/analytics', icon: BarChart3, label: d.analytics },
  ];

  const handleResolveDispute = (id) => {
    setData(prev => {
      const newDisputes = prev.disputes.map(dsp => 
        dsp.id === id ? { ...dsp, status: 'Resolved', decision: 'AI Settled 50/50' } : dsp
      );
      return { ...prev, disputes: newDisputes };
    });
  };

  const handleToggleUserStatus = (id) => {
    setData(prev => {
      const newUsers = prev.users.map(u => 
        u.id === id ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' } : u
      );
      return { ...prev, users: newUsers };
    });
  }

  const handleDeleteProject = (id) => {
    // Just simulating a status change to closed/inactive
    setData(prev => {
      const newProjects = prev.projects.map(p => 
        p.id === id ? { ...p, status: 'Completed' } : p
      );
      return { ...prev, projects: newProjects };
    });
  }

  return (
    <div className={`min-h-screen bg-[#F3F4F6] flex font-sans text-gray-900 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      
      {/* 📂 SIDEBAR */}
      <aside className="w-64 lg:w-72 bg-[#0A1128] text-white flex flex-col shadow-2xl h-screen sticky top-0 shrink-0 z-20">
        <div className="p-6 pb-8 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 text-2xl font-black tracking-tight hover:opacity-80 transition-opacity">
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <ShieldCheck size={24} className="text-white"/>
            </div>
            <span>Kafeel<span className="text-blue-500">.</span></span>
          </Link>
          <p className="mt-2 text-xs font-semibold text-blue-200/60 uppercase tracking-widest">{d.title}</p>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm outline-none",
                activeTab === item.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={18} className={cn("shrink-0", activeTab === item.id ? "text-white" : "text-gray-500")} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => navigate('/login')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all font-medium text-sm">
            <LogOut size={18} />
            <span>{d.logout}</span>
          </button>
        </div>
      </aside>

      {/* 📊 MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* 📌 TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black tracking-tight text-[#0A1128]">
              {navItems.find(i => i.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-bold text-gray-600 shadow-sm"
            >
              <Globe size={16} className="text-gray-400"/>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>

            <button className="relative text-gray-400 hover:text-[#0A1128] transition-colors" onClick={() => navigate('/dashboard/admin/disputes')}>
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3 cursor-pointer">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold text-[#0A1128]">Raya Salem</p>
                <p className="text-xs font-semibold text-blue-600">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-indigo-50">
                <UserCircle2 size={24} className="text-indigo-600"/>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#F9FAFB] p-8">
          <div className="max-w-[1400px] mx-auto pb-12">
            <Routes>
              <Route path="" element={
                <DashboardOverview 
                  data={data} d={d} isRtl={isRtl} navigate={navigate} 
                  handleResolveDispute={handleResolveDispute}
                  handleToggleUserStatus={handleToggleUserStatus}
                />
              } />
              <Route path="projects" element={
                <ProjectsView 
                  data={data} d={d} isRtl={isRtl} navigate={navigate}
                  handleDeleteProject={handleDeleteProject}
                />
              } />
              <Route path="users" element={
                <UsersView 
                  data={data} d={d} isRtl={isRtl} navigate={navigate}
                  handleToggleUserStatus={handleToggleUserStatus}
                />
              } />
              <Route path="escrow" element={<EscrowView data={data} d={d} isRtl={isRtl} />} />
              <Route path="disputes" element={
                <DisputesView 
                  data={data} d={d} isRtl={isRtl} navigate={navigate}
                  handleResolveDispute={handleResolveDispute}
                />
              } />
              <Route path="analytics" element={<AnalyticsView data={data} d={d} isRtl={isRtl} />} />
              <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUBCOMPONENTS / VIEWS
// ----------------------------------------------------

function DashboardOverview({ data, d, isRtl, navigate, handleResolveDispute, handleToggleUserStatus }) {
  return (
    <div className="space-y-8 animate-in fade-in zoom-in duration-300">
      {/* 🔷 SECTION 1: TOP STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-gray-50 text-gray-600"><Users size={24}/></div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><ArrowUpRight size={14}/> +12%</span>
          </div>
          <h3 className="text-4xl font-black text-[#0A1128] mb-1 relative z-10">{data.stats.users}</h3>
          <p className="text-sm font-bold text-gray-400 relative z-10">{d.stats.users}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600"><Briefcase size={24}/></div>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md"><ArrowUpRight size={14}/> +4</span>
          </div>
          <h3 className="text-4xl font-black text-[#0A1128] mb-1 relative z-10">{data.stats.projects}</h3>
          <p className="text-sm font-bold text-gray-400 relative z-10">{d.stats.projects}</p>
        </div>

        <div className="bg-[#0A1128] rounded-3xl p-6 shadow-[0_10px_30px_-5px_rgba(10,17,40,0.3)] flex flex-col relative overflow-hidden transform scale-100 lg:scale-105 z-10 border border-[#0A1128]">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-blue-500 rounded-full blur-[40px] opacity-40 mix-blend-screen pointer-events-none"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-emerald-500 rounded-full blur-[40px] opacity-20 mix-blend-screen pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-white/10 text-white backdrop-blur-md border border-white/10"><Lock size={24}/></div>
            <span className="flex items-center gap-1 text-xs font-bold text-blue-200 bg-blue-500/20 border border-blue-500/30 px-2 py-1 rounded-md backdrop-blur-sm"><TrendingUp size={14}/> {d.status.Active}</span>
          </div>
          <h3 className="text-4xl font-black text-white mb-1 relative z-10 tracking-tight">{formatCurrency(data.stats.escrow)}</h3>
          <p className="text-sm font-bold text-blue-200/80 relative z-10 tracking-wide uppercase">{d.stats.escrow}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col relative overflow-hidden transition-all hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.05)] hover:-translate-y-1">
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 size={24}/></div>
            <span className="flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">YTD</span>
          </div>
          <h3 className="text-4xl font-black text-[#0A1128] mb-1 relative z-10 tracking-tight">{formatCurrency(data.stats.released)}</h3>
          <p className="text-sm font-bold text-gray-400 relative z-10">{d.stats.released}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* 🏢 SECTION 3: PROJECTS OVERVIEW TABLE */}
        <section className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 className="text-xl font-black text-[#0A1128]">{d.projectsTbl.title}</h2>
            <button onClick={() => navigate('/dashboard/admin/projects')} className="text-blue-600 text-sm font-bold hover:text-blue-700 hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/80 sticky top-0 backdrop-blur-sm z-10">
                <tr>
                  <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colName}</th>
                  <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colBudget}</th>
                  <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colStatus}</th>
                  <th className="p-4 w-12 text-center"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.projects.slice(0, 4).map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-[#0A1128] text-sm">{p.name}</div>
                      <div className="text-xs text-gray-400 font-medium">{p.client}</div>
                    </td>
                    <td className="p-4 text-sm font-black text-[#0A1128]">{formatCurrency(p.budget)}</td>
                    <td className="p-4">
                      <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border", getStatusColor(p.status))}>
                        {d.status[p.status] || p.status}
                      </span>
                    </td>
                    <td className="p-4">
                       <button onClick={() => navigate(`/projects/${p.id.replace('PRJ-','')}`)} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-2 rounded-lg transition-colors">
                          <Eye size={16}/>
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ⚖️ SECTION 5: DISPUTES CENTER */}
        <section className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden xl:col-span-1 border-t-4 border-t-amber-500 flex flex-col h-[500px]">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl"><AlertOctagon size={20}/></div>
              <h2 className="text-xl font-black text-[#0A1128]">{d.disputesCenter.title}</h2>
            </div>
            <button onClick={() => navigate('/dashboard/admin/disputes')} className="text-blue-600 text-sm font-bold hover:text-blue-700 hover:underline">View All</button>
          </div>
          <div className="p-0 overflow-y-auto flex-1">
            <div className="divide-y divide-gray-100">
              {data.disputes.map((dsp, i) => (
                <div key={i} className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs shrink-0 group-hover:bg-white transition-colors">
                        {dsp.id.split('-')[1]}
                     </div>
                     <div>
                       <p className="text-sm font-bold text-[#0A1128] mb-0.5">{dsp.participants}</p>
                       <p className="text-xs font-semibold text-gray-500">{d.disputesCenter.colCase}: {dsp.id}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                     <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border", getStatusColor(dsp.status))}>
                       {d.status[dsp.status] || dsp.status}
                     </span>
                     
                     {dsp.status === 'Resolved' && (
                       <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{dsp.decision}</span>
                     )}
                     
                     {dsp.status !== 'Resolved' && (
                        <button onClick={() => handleResolveDispute(dsp.id)} className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                           <CheckCircle size={14}/> {d.actions.resolve}
                        </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

function ProjectsView({ data, d, isRtl, navigate, handleDeleteProject }) {
  const [filter, setFilter] = useState('');

  const filteredProjects = filter 
    ? data.projects.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) || p.client.toLowerCase().includes(filter.toLowerCase()))
    : data.projects;

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-black text-[#0A1128]">{d.projectsTbl.title}</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16}/>
            <input 
              type="text" 
              placeholder="Search projects..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colName}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colClient}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colBudget}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colProgress}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colStatus}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.projectsTbl.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredProjects.length === 0 ? (
               <tr><td colSpan="6" className="p-8 text-center text-gray-500">No projects found.</td></tr>
            ) : filteredProjects.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-[#0A1128] text-sm">{p.name}</div>
                  <div className="text-xs text-gray-400 font-medium">{p.id}</div>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-600">{p.client}</td>
                <td className="p-4 text-sm font-black text-[#0A1128]">{formatCurrency(p.budget)}</td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{width: `${p.progress}%`}}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-500">{p.progress}%</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border", getStatusColor(p.status))}>
                    {d.status[p.status] || p.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => navigate(`/projects/${p.id.replace('PRJ-','')}`)} className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition-colors" title={d.actions.view}>
                    <Eye size={16}/>
                  </button>
                  <button onClick={() => handleDeleteProject(p.id)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-2 rounded-lg transition-colors border border-gray-200" title={d.actions.edit}>
                    <CheckCircle size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersView({ data, d, isRtl, navigate, handleToggleUserStatus }) {
  const [filter, setFilter] = useState('');

  const filteredUsers = filter 
    ? data.users.filter(u => u.name.toLowerCase().includes(filter.toLowerCase()) || u.role.toLowerCase().includes(filter.toLowerCase()))
    : data.users;

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-black text-[#0A1128]">{d.usersMgt.title}</h2>
        <div className="flex flex-wrap items-center gap-3">
           <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16}/>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 flex items-center gap-2">
             <Filter size={16}/> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.usersMgt.colName}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.usersMgt.colRole}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.usersMgt.colStatus}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.usersMgt.colActivity}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.usersMgt.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
               <tr><td colSpan="5" className="p-8 text-center text-gray-500">No users found.</td></tr>
            ) : filteredUsers.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                      {u.name.substring(0,2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-bold text-[#0A1128] text-sm block">{u.name}</span>
                      <span className="text-xs text-gray-400">{u.id}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={cn("inline-flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded-md", u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-gray-100 text-gray-500 border border-gray-200')}>
                    <span className={cn("w-2 h-2 rounded-full", u.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400')}></span>
                    {d.status[u.status] || u.status}
                  </span>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-500">{u.activity}</td>
                <td className="p-4">
                   <button 
                     onClick={() => handleToggleUserStatus(u.id)}
                     className="bg-white border border-gray-200 text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                   >
                     {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EscrowView({ data, d, isRtl }) {
  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#0A1128]">{d.escrowPanel.title}</h2>
      </div>
      <section className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 lg:w-3/4 leading-relaxed mt-1">{d.escrowPanel.desc}</p>
            </div>
            <div className="flex gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400 mb-0.5 text-right">{d.escrowPanel.pending}</p>
                <p className="text-lg font-black text-amber-500">{formatCurrency(8500)}</p>
              </div>
            </div>
        </div>
        
        <div className="p-12 bg-gray-50/50">
            {/* Visual Flow Pipeline */}
            <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto gap-8 md:gap-0">
              
              {/* Client Node */}
              <div className="flex flex-col items-center gap-4 w-48 z-10">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-gray-200 shadow-md flex items-center justify-center text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors cursor-pointer">
                  <UserCircle2 size={40} />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#0A1128]">{d.escrowPanel.client}</p>
                  <p className="text-xs font-semibold text-gray-500 mt-1">Stripe / Bank</p>
                </div>
              </div>

              {/* Flow Line 1 */}
              <div className="hidden md:flex flex-1 h-1.5 bg-gray-200 rounded-full relative mx-4 items-center">
                  <div className="absolute w-full h-full bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50 animate-pulse rounded-full"></div>
                  <div className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-gray-200 shadow-sm ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
                    <ArrowRightLeft size={16} className="text-gray-400"/>
                  </div>
              </div>

              {/* Escrow Hub */}
              <div className="flex flex-col items-center gap-4 w-56 z-10 transform scale-110">
                <div className="w-28 h-28 rounded-[2rem] bg-[#0A1128] border-8 border-blue-100 shadow-[0_0_40px_rgba(37,99,235,0.25)] flex items-center justify-center text-white relative cursor-pointer hover:scale-105 transition-transform">
                  <div className="absolute inset-0 rounded-[1.5rem] border-2 border-blue-500/30 animate-ping opacity-20"></div>
                  <Lock size={48} className="text-blue-400" />
                </div>
                <div className="text-center bg-white px-6 py-4 rounded-2xl shadow-lg border border-gray-100 relative z-10">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{d.escrowPanel.platform}</p>
                  <p className="text-2xl font-black text-[#0A1128]">{formatCurrency(data.stats.escrow)}</p>
                </div>
              </div>

              {/* Flow Line 2 */}
              <div className="hidden md:flex flex-1 h-1.5 bg-gray-200 rounded-full relative mx-4 items-center">
                  <div className="absolute w-[80%] h-full bg-emerald-400 rounded-full"></div>
                  <div className={`absolute top-1/2 -translate-y-1/2 bg-white rounded-full p-2 border border-gray-200 shadow-sm ${isRtl ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'}`}>
                    <CheckCircle2 size={16} className="text-emerald-500"/>
                  </div>
              </div>

              {/* Freelancer Node */}
              <div className="flex flex-col items-center gap-4 w-48 z-10">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-emerald-200 shadow-md flex items-center justify-center text-emerald-600 hover:bg-emerald-50 cursor-pointer transition-colors">
                  <CircleDollarSign size={40} />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-[#0A1128]">{d.escrowPanel.freelancer}</p>
                  <p className="text-sm font-black text-emerald-600 mt-1">{formatCurrency(data.stats.released)}</p>
                </div>
              </div>

            </div>
        </div>
      </section>
    </div>
  )
}

function DisputesView({ data, d, isRtl, navigate, handleResolveDispute }) {
  const [filter, setFilter] = useState('');

  const filteredDisputes = filter 
    ? data.disputes.filter(dsp => dsp.participants.toLowerCase().includes(filter.toLowerCase()) || dsp.id.toLowerCase().includes(filter.toLowerCase()))
    : data.disputes;

  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-black text-[#0A1128]">{d.disputesCenter.title}</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={16}/>
            <input 
              type="text" 
              placeholder="Search disputes..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="bg-white border border-gray-200 text-gray-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 flex items-center gap-2">
             <Filter size={16}/> Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-100">
             <tr>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.disputesCenter.colCase}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.disputesCenter.colParticipants}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.disputesCenter.colStatus}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.disputesCenter.colDecision}</th>
              <th className={`p-4 text-xs font-bold text-gray-400 uppercase tracking-wider ${isRtl ? 'text-right' : 'text-left'}`}>{d.disputesCenter.colActions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDisputes.length === 0 ? (
               <tr><td colSpan="5" className="p-8 text-center text-gray-500">No disputes found.</td></tr>
            ) : filteredDisputes.map((dsp, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors group">
                <td className="p-4">
                   <div className="font-bold text-[#0A1128] text-sm">{dsp.id}</div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-gray-700 text-sm">{dsp.participants}</span>
                </td>
                <td className="p-4">
                  <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold border", getStatusColor(dsp.status))}>
                    {d.status[dsp.status] || dsp.status}
                  </span>
                </td>
                <td className="p-4 text-sm font-semibold text-gray-600">
                  {dsp.status === 'Resolved' && (
                     <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">{dsp.decision}</span>
                  )}
                  {dsp.status !== 'Resolved' && '-'}
                </td>
                <td className="p-4 flex gap-2">
                   <button onClick={() => navigate(`/dispute/${dsp.taskId}`)} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold flex items-center gap-1">
                      <Eye size={14}/> {d.actions.view}
                   </button>
                   {dsp.status !== 'Resolved' && (
                     <button onClick={() => handleResolveDispute(dsp.id)} className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <CheckCircle size={14}/> {d.actions.resolve}
                     </button>
                   )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AnalyticsView({ data, d, isRtl }) {
  return (
    <div className="animate-in fade-in zoom-in duration-300">
      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#0A1128]">{d.analytics}</h2>
      </div>
      
      <section className="bg-white rounded-[2rem] border border-gray-200 shadow-sm p-8 relative">
          <div className="mb-10 flex justify-between items-center border-b border-gray-100 pb-6">
            <div>
              <h2 className="text-2xl font-black text-[#0A1128]">{d.chart.title}</h2>
              <p className="text-gray-500 font-medium text-sm mt-1">Monthly progression of locked funds.</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
               <Activity size={24} />
            </div>
          </div>
          
          <div className="h-80 flex items-end justify-between gap-4 px-2 mt-auto">
            {data.revenue.map((item, i) => {
              const max = 25000;
              const height = (item.value / max) * 100;
              return (
                <div key={i} className="flex flex-col items-center gap-4 flex-1 group h-full justify-end">
                  <div className="w-full max-w-[80px] bg-blue-50 rounded-t-2xl overflow-hidden relative flex items-end h-full">
                    <div 
                      className="w-full bg-[#0A1128] rounded-t-2xl transition-all duration-1000 group-hover:bg-blue-600 relative overflow-visible"
                      style={{ height: `${height}%` }}
                    >
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-xl pointer-events-none after:content-[''] after:absolute after:top-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-transparent after:border-t-gray-900">
                          {formatCurrency(item.value)}
                        </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{item.month}</span>
                </div>
              );
            })}
          </div>
      </section>
    </div>
  )
}
