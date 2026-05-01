import { useEffect, useState, FC, useMemo, useRef, cloneElement, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Lock, CheckCircle, Upload, Send, X, Users, TrendingUp, 
  FileText, ChevronLeft, Star, Shield, AlertCircle, Clock, Zap,
  Activity, ArrowUpRight, DollarSign, Target, Briefcase, CreditCard, ShieldCheck
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, User, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

/* ─── Apple Design Tokens ─── */
const APPLE_SPRINGS = {
  soft: { type: "spring", stiffness: 100, damping: 30 },
  standard: { type: "spring", stiffness: 260, damping: 32 },
  bouncy: { type: "spring", stiffness: 400, damping: 22 },
};

/* ─── Types ─── */
interface MyTask extends Task {
  projectName: string;
  projectId: string;
}

interface MyInvitation {
  id: string;
  projectId: string;
  projectName: string;
  taskName: string;
  budget: number;
  deadline: string;
  sender: string;
  senderRole: string;
  description: string;
  requirements: string[];
  attachments: string[];
}

/* ─── Premium Components ─── */

const AppleMaterialCard: FC<{ 
  children: React.ReactNode; 
  className?: string; 
  layoutId?: string; 
  onClick?: () => void;
  variant?: 'glass' | 'dark' | 'solid';
}> = ({ children, className, layoutId, onClick, variant = 'glass' }) => (
  <motion.div
    layoutId={layoutId}
    onClick={onClick}
    whileHover={onClick ? { 
      scale: 1.015, 
      y: -6,
      boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)"
    } : {}}
    whileTap={onClick ? { scale: 0.985 } : {}}
    transition={APPLE_SPRINGS.standard}
    className={cn(
      "relative group overflow-hidden rounded-[2.2rem] transition-all duration-500 noise-heavy",
      variant === 'glass' ? "apple-card-light" : 
      variant === 'dark' ? "apple-card-dark apple-inner-shadow" : 
      "bg-white border border-gray-100 shadow-sm",
      className
    )}
  >
    {/* Highlight Glare */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
    
    {/* Material Edge (Inner Border) */}
    <div className="absolute inset-[1px] rounded-[2.1rem] border border-white/20 pointer-events-none z-0" />
    
    <div className="relative z-10 h-full">{children}</div>
  </motion.div>
);

const RollingNumber: FC<{ value: number; prefix?: string }> = ({ value, prefix = "$" }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const currentVal = useRef(0);

  useEffect(() => {
    if (numberRef.current) {
      gsap.to(currentVal, {
        current: value,
        duration: 2.5,
        ease: "power4.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = `${prefix}${Math.floor(currentVal.current).toLocaleString()}`;
          }
        }
      });
    }
  }, [value, prefix]);

  return <span ref={numberRef} className="tabular-nums font-black">{prefix}0</span>;
};

const MagneticButton: FC<{ children: React.ReactNode; onClick?: () => void; className?: string; variant?: 'primary' | 'secondary' | 'ghost' }> = ({ children, onClick, className, variant = 'primary' }) => {
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (!btnRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = btnRef.current.getBoundingClientRect();
    const x = (clientX - (left + width / 2)) * 0.35;
    const y = (clientY - (top + height / 2)) * 0.35;
    gsap.to(btnRef.current, { x, y, duration: 0.3, ease: "power2.out" });
  };

  const handleMouseLeave = () => {
    gsap.to(btnRef.current, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1.1, 0.4)" });
  };

  return (
    <button
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={cn(
        "relative py-3.5 px-8 rounded-2xl font-black transition-all active:scale-90 shadow-lg",
        variant === 'primary' ? "bg-[#0D1B2A] text-white shadow-[#0D1B2A]/30 border-t border-white/10" : 
        variant === 'secondary' ? "bg-white/80 backdrop-blur-md border border-white text-[#0D1B2A] hover:bg-white" :
        "bg-transparent text-gray-500 hover:text-[#0D1B2A] shadow-none",
        className
      )}
    >
      <div className="relative z-10 flex items-center justify-center gap-2">{children}</div>
    </button>
  );
};

const ProgressRing: FC<{ progress: number; size?: number; color?: string }> = ({ progress, size = 44, color = "#C9A84C" }) => {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle className="text-black/5" strokeWidth="3" stroke="currentColor" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <motion.circle
          className="transition-all duration-1000 ease-out"
          strokeWidth="3"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          stroke={color}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-gray-400">
        {Math.round(progress)}
      </div>
    </div>
  );
};

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState<MyInvitation | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const user: User | null = api.getCurrentUser();

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });

    const handleGlobalMouseMove = (e: globalThis.MouseEvent) => {
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 1.2,
          ease: "power3.out"
        });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  const { myTasks, myInvitations, myEarnings, escrowed, activeCount } = useMemo(() => {
    let tasks: MyTask[] = [];
    let invites: MyInvitation[] = [];
    let earnings = 0;
    let held = 0;

    if (!user) return { myTasks: [], myInvitations: [], myEarnings: 0, escrowed: 0, activeCount: 0 };

    projects.forEach(p => {
      p.tasks.forEach(t => {
        const isMatch = t.assignedTo === user.id || (user.email && t.assignedToEmail?.toLowerCase() === user.email.toLowerCase());
        if (isMatch) {
          if (t.inviteStatus === 'Pending') {
            invites.push({
              id: t.id, projectId: p.id, projectName: p.title, taskName: t.name,
              budget: t.payment, deadline: t.deadline ?? 'مفتوح', sender: p.owner, senderRole: 'مدير المشروع',
              description: t.description ?? 'لقد تمت دعوتك للعمل على هذه المهمة.',
              requirements: [t.name, 'الالتزام بمواعيد التسليم', 'تسليم العمل بجودة عالية'],
              attachments: []
            });
          } else if (t.inviteStatus !== 'Rejected') {
            tasks.push({ ...t, projectName: p.title, projectId: p.id });
            if (t.paid) earnings += t.payment;
            else held += t.payment;
          }
        }
      });
    });

    return { myTasks: tasks, myInvitations: invites, myEarnings: earnings, escrowed: held, activeCount: tasks.filter(t => !t.paid).length };
  }, [projects, user]);

  if (!user) return null;

  const handleAcceptInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Accepted');
      const updated = await api.getProjects();
      setProjects(updated);
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen relative overflow-hidden premium-bg font-sans selection:bg-[#C9A84C]/30 pb-20" dir="rtl">
      {/* Dynamic Background Spotlight */}
      <div ref={spotlightRef} className="spotlight fixed top-0 left-0 pointer-events-none z-0 opacity-40" />
      
      {/* Floating Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
         <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.1, 0.05] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-[10%] right-[10%] w-[800px] h-[800px] bg-[#C9A84C]/10 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        {/* Apple-Style Navigation Header */}
        <motion.header 
          initial={{ y: -15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={APPLE_SPRINGS.soft}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-14"
        >
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.25em] text-[#C9A84C] mb-3 shadow-sm border-white/40">
              <Zap size={12} className="animate-pulse fill-[#C9A84C]/20" /> نظام التعاقد المباشر
            </div>
            <h1 className="text-4xl font-black text-[#0D1B2A] tracking-tighter mb-3 leading-none">
              مرحباً عمر <span className="text-[#C9A84C]">.</span>
            </h1>
            <p className="text-base font-medium text-gray-400 flex items-center gap-2">
              <Activity size={14} className="text-emerald-500" /> لوحة التحكم المالية قيد المزامنة الآن
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl px-5 py-2.5 shadow-2xl shadow-emerald-900/5 group transition-all hover:bg-white/30 cursor-default">
             <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                   <div className="relative">
                      <Shield size={14} className="text-emerald-500 relative z-10" fill="currentColor" fillOpacity={0.2} />
                      <motion.div 
                        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 bg-emerald-400 rounded-full blur-md z-0" 
                      />
                   </div>
                   <span className="text-[9px] font-black text-emerald-600/80 uppercase tracking-[0.25em]">Secure Enclave</span>
                </div>
                <div className="flex items-center gap-3">
                   <p className="text-sm font-black text-[#0D1B2A] tracking-tight">العقد محمي نشط</p>
                   <div className="flex gap-0.5">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i}
                          animate={{ height: [4, 10, 4] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                          className="w-0.5 bg-emerald-500 rounded-full"
                        />
                      ))}
                   </div>
                </div>
             </div>
             <div className="w-px h-8 bg-[#0D1B2A]/5 mx-2" />
             <div className="flex flex-col items-end gap-1">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">تغطية الضمان</span>
                <span className="text-[12px] font-black text-[#0D1B2A]">100% مؤمن</span>
             </div>
          </div>
        </motion.header>

        {loading ? (
          <div className="py-40 text-center">
             <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-3 border-gray-100 border-t-[#C9A84C] rounded-full mx-auto mb-8 shadow-2xl" />
             <p className="text-[11px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">فك تشفير المحفظة</p>
          </div>
        ) : (
          <>
            {/* Visual Stats Grid */}
            <div className="grid lg:grid-cols-4 gap-6 mb-16">
               {/* Primary Wallet */}
               <AppleMaterialCard variant="dark" className="lg:col-span-2 h-40 relative group cursor-default">
                  <div className="absolute -top-[40%] -right-[10%] w-[120%] h-[120%] bg-gradient-to-br from-white/5 to-transparent pointer-events-none blur-[60px]" />
                  <div className="absolute bottom-0 right-0 p-8 opacity-10 group-hover:scale-110 group-hover:-translate-y-4 group-hover:rotate-6 transition-all duration-1000">
                     <CreditCard size={180} className="text-[#C9A84C]" />
                  </div>
                  <div className="p-8 h-full flex flex-col justify-between relative z-10">
                     <div className="flex justify-between items-start">
                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#C9A84C] flex items-center gap-2">
                           <div className="w-2 h-2 bg-[#C9A84C] rounded-full animate-pulse shadow-[0_0_12px_#C9A84C]" />
                           محفظة الأرباح
                        </span>
                        <div className="bg-white/10 backdrop-blur-xl p-3 rounded-2xl border border-white/10 group-hover:bg-white/20 transition-colors"><ArrowUpRight size={20} className="text-white" /></div>
                     </div>
                     <div className="flex items-baseline gap-4 text-5xl font-black">
                        <RollingNumber value={myEarnings} />
                        <span className="text-white/30 text-sm font-black uppercase tracking-[0.2em]">Kafil Balance</span>
                     </div>
                  </div>
               </AppleMaterialCard>

               {/* Escrow Status */}
               <AppleMaterialCard className="h-40 flex flex-col justify-between p-7 bg-white/50 border-white/80">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">الضمان (Escrow)</span>
                       <p className="text-[9px] font-bold text-emerald-600 flex items-center gap-1.5 bg-emerald-50 w-fit px-2 py-0.5 rounded-full border border-emerald-100">
                         <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> حماية نشطة
                       </p>
                    </div>
                    <div className="w-10 h-10 bg-[#C9A84C]/10 rounded-2xl flex items-center justify-center text-[#C9A84C] border border-[#C9A84C]/20 shadow-inner">
                       <Lock size={18} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black tracking-tighter text-[#0D1B2A] tabular-nums"><RollingNumber value={escrowed} /></h3>
                    <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">إجمالي المبالغ المحجوزة</p>
                  </div>
               </AppleMaterialCard>

               {/* Active Context */}
               <AppleMaterialCard className="h-40 flex flex-col justify-between p-7 bg-white/50 border-white/80">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">سير العمل</span>
                    <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-200">
                       <Target size={18} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-6">
                     <div className="flex-1">
                       <h3 className="text-3xl font-black tracking-tighter text-[#0D1B2A] tabular-nums">{activeCount}</h3>
                       <p className="text-[10px] font-black text-gray-400 mt-2 uppercase tracking-widest">مهام قيد الإنجاز</p>
                     </div>
                     <ProgressRing progress={myTasks.length ? (myTasks.filter(t => t.paid).length / myTasks.length) * 100 : 0} size={54} />
                  </div>
               </AppleMaterialCard>
            </div>

            {/* Layout Shift: The Feed Model */}
            <div className="grid lg:grid-cols-12 gap-10">
               
               {/* Primary Column: The Work Horse */}
               <div className="lg:col-span-8 space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-[#0D1B2A] tracking-tight flex items-center gap-3">
                       <Briefcase size={22} className="text-[#0D1B2A]" /> العقود الحالية
                    </h2>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">{myTasks.length} تعاقدات</span>
                    </div>
                  </div>

                  {myTasks.length === 0 ? (
                    <AppleMaterialCard className="py-24 text-center border-dashed border-2 border-gray-200 bg-transparent shadow-none rounded-[2.5rem]">
                      <FileText size={40} className="mx-auto text-gray-200 mb-6 opacity-40" />
                      <p className="text-xl font-black text-gray-300">لا يوجد تعاقدات نشطة في الوقت الحالي</p>
                    </AppleMaterialCard>
                  ) : (
                    <div className="grid gap-6">
                      {myTasks.map(t => (
                        <AppleMaterialCard 
                          key={t.id}
                          layoutId={`project-card-${t.projectId}`}
                          onClick={() => navigate(`/projects/${t.projectId}`)}
                          className="hover:border-[#C9A84C]/40 group border-white/60"
                        >
                          <div className="flex flex-col md:flex-row items-stretch">
                            <div className="p-7 flex-1 flex flex-col md:flex-row items-center gap-8">
                              <motion.div 
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                className={cn(
                                  "w-16 h-16 rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-2xl relative z-10 transition-colors duration-500",
                                  t.paid ? "bg-emerald-500 text-white" : "bg-[#0D1B2A] text-white"
                                )}
                              >
                                {t.paid ? <CheckCircle size={30} strokeWidth={2.5} /> : <Zap size={30} className="fill-[#C9A84C] text-[#C9A84C]" />}
                              </motion.div>
                              <div className="flex-1 text-center md:text-right">
                                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                                   <h3 className="text-xl font-black text-[#0D1B2A] tracking-tight group-hover:text-blue-600 transition-colors duration-300">{t.name}</h3>
                                   {t.status === 'Disputed' && <div className="bg-red-500 text-white px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20">نزاع نشط</div>}
                                </div>
                                <p className="text-base font-bold text-gray-400 mb-4">{t.projectName}</p>
                                <div className="flex items-center justify-center md:justify-start gap-3">
                                  <div className={cn(
                                    "px-3 py-1 rounded-xl text-[10px] font-black border uppercase tracking-wider",
                                    t.paid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                  )}>
                                    {t.paid ? 'تم التسوية وصرف المبلغ' : 'تحت الحماية التعاقدية'}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold">
                                     <Clock size={12} /> {t.deadline || 'مفتوح'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/30 backdrop-blur-md md:w-80 p-7 flex items-center justify-between border-t lg:border-t-0 lg:border-r border-white/60 group-hover:bg-white/60 transition-colors">
                              <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 opacity-60">قيمة التعاقد</p>
                                <p className="text-3xl font-black text-[#0D1B2A] tabular-nums tracking-tighter">{formatCurrency(t.payment)}</p>
                              </div>
                              <motion.div whileHover={{ x: -4 }} className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-white group-hover:bg-[#0D1B2A] transition-all shadow-lg group-hover:shadow-[#0D1B2A]/20">
                                <ChevronLeft size={24} />
                              </motion.div>
                            </div>
                          </div>
                        </AppleMaterialCard>
                      ))}
                    </div>
                  )}
               </div>

               {/* Secondary Column: The Opportunity Grid */}
               <div className="lg:col-span-4 space-y-8">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-2xl font-black text-[#0D1B2A] tracking-tight flex items-center gap-3">
                       <Zap size={20} className="text-[#C9A84C]" fill="currentColor" /> الفرص الجديدة
                    </h2>
                  </div>

                  <AnimatePresence>
                    {myInvitations.length === 0 ? (
                      <AppleMaterialCard className="p-10 text-center bg-white/30 border-dashed border-2 border-gray-200 shadow-none rounded-[2.5rem]">
                         <Activity size={32} className="mx-auto text-gray-100 mb-4 animate-pulse" />
                         <p className="text-[11px] font-black text-gray-300 uppercase tracking-[0.3em]">بانتظار دعوات جديدة</p>
                      </AppleMaterialCard>
                    ) : (
                      <div className="space-y-6">
                        {myInvitations.map(inv => (
                          <motion.div key={inv.id} initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                            <AppleMaterialCard className="p-8 bg-gradient-to-br from-white/80 to-white/40 border-white/80 shadow-2xl relative overflow-hidden">
                               <div className="absolute -top-4 -left-4 w-20 h-20 bg-blue-500/5 blur-3xl rounded-full" />
                               <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-4 block bg-blue-50 w-fit px-3 py-1 rounded-full border border-blue-100 shadow-sm">دعوة عمل جديدة</span>
                               <h3 className="text-xl font-black text-[#0D1B2A] mb-2 tracking-tight leading-tight">{inv.projectName}</h3>
                               <p className="text-sm font-bold text-gray-400 mb-6 line-clamp-1">{inv.sender} • {inv.taskName}</p>
                               
                               <div className="flex justify-between items-end mb-8 bg-white/40 p-4 rounded-2xl border border-white/60">
                                  <div>
                                     <p className="text-[9px] font-black text-gray-400 uppercase mb-1 tracking-widest">الميزانية الكلية</p>
                                     <p className="text-2xl font-black text-[#1A7F74] tabular-nums tracking-tighter">{formatCurrency(inv.budget)}</p>
                                  </div>
                                  <ProgressRing progress={100} size={36} color="#1A7F74" />
                               </div>

                               <div className="flex flex-col gap-3">
                                  <MagneticButton onClick={() => handleAcceptInvite(inv)} className="w-full">قبول التعاقد</MagneticButton>
                                  <MagneticButton onClick={() => setSelectedInvitation(inv)} variant="secondary" className="w-full shadow-none border-gray-100">عرض التفاصيل</MagneticButton>
                               </div>
                            </AppleMaterialCard>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </AnimatePresence>
               </div>
            </div>
          </>
        )}
      </div>

      {/* Apple-Style Detail Modal */}
      <AnimatePresence>
        {selectedInvitation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedInvitation(null)}
              className="absolute inset-0 bg-[#0D1B2A]/80 backdrop-blur-[40px]" 
            />
            <motion.div 
              initial={{ scale: 0.92, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 60 }}
              transition={APPLE_SPRINGS.standard}
              className="bg-[#F9F4EE] w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-[3rem] shadow-[0_80px_160px_-20px_rgba(0,0,0,0.7)] relative z-10 border border-white/20 flex flex-col" 
            >
              {/* Modal Header: Secure Context */}
              <div className="p-10 border-b border-[#E8DDD0] bg-white/60 backdrop-blur-2xl flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#C9A84C] to-transparent opacity-50" />
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                     <div className="px-3 py-1 bg-[#0D1B2A] text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-lg shadow-lg shadow-[#0D1B2A]/20">عقد ضمار</div>
                     <div className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={12} fill="currentColor" className="opacity-20" /> الحماية مفعلة
                     </div>
                  </div>
                  <h2 className="text-4xl font-black text-[#0D1B2A] tracking-tighter leading-tight">{selectedInvitation.projectName}</h2>
                  <p className="text-gray-400 font-bold flex items-center gap-2 text-sm">
                    رقم العملية: <span className="text-[#0D1B2A] font-mono tracking-widest">{selectedInvitation.id.toUpperCase()}</span>
                  </p>
                </div>
                <button onClick={() => setSelectedInvitation(null)} className="w-16 h-16 rounded-[2rem] bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 transition-all shadow-2xl group">
                  <X size={32} className="text-gray-300 group-hover:text-red-500 group-hover:rotate-90 transition-all duration-500" />
                </button>
              </div>

              {/* Modal Body: Two-Column Precision */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <div className="grid lg:grid-cols-12 gap-10">
                  
                  {/* Left Column: Brief & Requirements */}
                  <div className="lg:col-span-7 space-y-10">
                    <motion.section 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-4"
                    >
                       <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-[0.2em] flex items-center gap-3">
                         <FileText size={18} className="text-[#C9A84C]" /> وصف نطاق العمل
                       </h3>
                       <div className="bg-white border border-[#E8DDD0] p-8 rounded-[2.5rem] text-lg text-gray-600 leading-relaxed font-medium shadow-sm relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C] opacity-20 group-hover:opacity-100 transition-opacity" />
                          {selectedInvitation.description}
                       </div>
                    </motion.section>

                    <motion.section 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-black text-[#0D1B2A] uppercase tracking-[0.2em] flex items-center gap-3">
                         <Target size={18} className="text-emerald-500" /> مخرجات العقد الإلزامية
                      </h3>
                      <div className="grid gap-4">
                        {selectedInvitation.requirements.map((req, idx) => (
                          <motion.div 
                            key={idx}
                            whileHover={{ x: 8, scale: 1.01 }}
                            className="flex items-center gap-6 bg-white border border-white p-6 rounded-[1.8rem] shadow-sm hover:shadow-md transition-all group"
                          >
                             <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500 shadow-inner">
                                <CheckCircle size={22} strokeWidth={2.5} />
                             </div>
                             <span className="font-black text-[#0D1B2A] text-lg tracking-tight">{req}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.section>
                  </div>

                  {/* Right Column: Financial Vault */}
                  <div className="lg:col-span-5 space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                       <AppleMaterialCard variant="dark" className="p-10 h-fit shadow-2xl relative group overflow-hidden border-white/5">
                          {/* Background Symbol */}
                          <Lock size={200} className="absolute -bottom-10 -left-10 text-white/5 -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-1000" />
                          
                          <div className="relative z-10 space-y-8">
                             <div className="space-y-1">
                                <span className="text-[10px] font-black text-[#C9A84C] uppercase tracking-[0.4em]">الميزانية المؤمنة</span>
                                <div className="h-0.5 w-12 bg-[#C9A84C] rounded-full" />
                             </div>
                             
                             <div className="space-y-2">
                                <div className="flex items-baseline gap-4">
                                   <span className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                                      <RollingNumber value={selectedInvitation.budget} />
                                   </span>
                                   <span className="text-[#C9A84C] text-xl font-black uppercase tracking-widest">USD</span>
                                </div>
                                <p className="text-blue-200/40 text-[10px] font-bold uppercase tracking-[0.2em]">Kafil Escrow Protection</p>
                             </div>

                             <div className="bg-white/5 rounded-3xl p-6 border border-white/10 space-y-4">
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-bold text-gray-400">حالة الإيداع</span>
                                   <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">مكتمل</span>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-bold text-gray-400">الموعد النهائي</span>
                                   <span className="text-xs font-black text-white">{selectedInvitation.deadline}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                   <span className="text-xs font-bold text-gray-400">مرسل الطلب</span>
                                   <span className="text-xs font-black text-white">{selectedInvitation.sender}</span>
                                </div>
                             </div>
                          </div>
                       </AppleMaterialCard>
                    </motion.div>

                    {/* Security Guarantee Card */}
                    <motion.div 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                      className="p-8 glass rounded-[2rem] border-emerald-500/20 bg-emerald-500/5 space-y-4"
                    >
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                             <Shield size={16} fill="currentColor" />
                          </div>
                          <span className="text-xs font-black text-[#0D1B2A]">ضمان كفيل الذهبي</span>
                       </div>
                       <p className="text-xs font-medium text-emerald-800/70 leading-relaxed">
                          هذه الميزانية مودعة حالياً في حساب الضمان التابع لكفيل. لا يمكن استردادها من قبل العميل إلا بموافقتك أو بقرار تحكيمي نهائي.
                       </p>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Modal Footer: Action Enclave */}
              <div className="p-10 border-t border-[#E8DDD0] bg-white/80 backdrop-blur-3xl flex gap-6">
                <MagneticButton 
                  onClick={() => handleAcceptInvite(selectedInvitation)} 
                  className="flex-[3] py-6 text-2xl h-20 shadow-[0_20px_40px_-10px_rgba(26,127,116,0.4)]"
                >
                  <div className="flex items-center gap-4">
                     قبول العقد وبدء التنفيذ
                     <ArrowUpRight size={24} />
                  </div>
                </MagneticButton>
                <MagneticButton 
                  onClick={() => setSelectedInvitation(null)} 
                  variant="secondary" 
                  className="flex-1 py-6 text-lg h-20 shadow-none border-gray-100"
                >
                  تجاهل العرض
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
