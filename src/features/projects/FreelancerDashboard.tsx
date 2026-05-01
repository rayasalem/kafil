import { useEffect, useState, FC, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { 
  Lock, CheckCircle, Upload, Send, X, Users, TrendingUp, 
  FileText, ChevronLeft, Star, Shield, AlertCircle, Clock, Zap
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, User, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

/* ─── Apple Design Tokens ─── */
const APPLE_SPRINGS = {
  soft: { type: "spring", stiffness: 100, damping: 30 },
  standard: { type: "spring", stiffness: 260, damping: 32 },
  bouncy: { type: "spring", stiffness: 400, damping: 28 },
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

const AppleGlassCard: FC<{ children: React.ReactNode; className?: string; layoutId?: string; onClick?: () => void }> = ({ children, className, layoutId, onClick }) => (
  <motion.div
    layoutId={layoutId}
    onClick={onClick}
    whileHover={onClick ? { scale: 1.01, y: -4 } : {}}
    whileTap={onClick ? { scale: 0.98 } : {}}
    transition={APPLE_SPRINGS.standard}
    className={cn(
      "relative group overflow-hidden glass rounded-[2.5rem] p-1 border-white/40 shadow-2xl",
      className
    )}
  >
    {/* Subtle highlight glare */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const RollingNumber: FC<{ value: number; prefix?: string }> = ({ value, prefix = "$" }) => {
  const numberRef = useRef<HTMLSpanElement>(null);
  const currentVal = useRef(0);

  useEffect(() => {
    if (numberRef.current) {
      gsap.to(currentVal, {
        current: value,
        duration: 2,
        ease: "power4.out",
        onUpdate: () => {
          if (numberRef.current) {
            numberRef.current.innerText = `${prefix}${Math.floor(currentVal.current).toLocaleString()}`;
          }
        }
      });
    }
  }, [value, prefix]);

  return <span ref={numberRef} className="tabular-nums">{prefix}0</span>;
};

const StatHeroCard: FC<{ label: string; value: number; icon: React.ReactNode; variant?: 'default' | 'vault' | 'success' }> = ({ label, value, icon, variant = 'default' }) => {
  const isVault = variant === 'vault';
  const isSuccess = variant === 'success';

  return (
    <AppleGlassCard className={cn(
      "h-44 flex flex-col justify-between p-8",
      isVault ? "bg-[#0D1B2A]/90 text-white border-white/10" : "bg-white/40"
    )}>
      <div className="flex items-center justify-between">
        <span className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em]",
          isVault ? "text-blue-300/60" : "text-gray-400"
        )}>{label}</span>
        <div className={cn(
          "p-3 rounded-2xl",
          isVault ? "bg-white/5 text-blue-300" : isSuccess ? "bg-emerald-50 text-emerald-600" : "bg-white shadow-sm text-gray-400"
        )}>
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-5xl font-black tracking-tighter">
          <RollingNumber value={value} />
        </h3>
      </div>
    </AppleGlassCard>
  );
};

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState<MyInvitation | null>(null);

  const user: User | null = api.getCurrentUser();

  useEffect(() => {
    api.getProjects().then(data => {
      setProjects(data);
      setLoading(false);
    });
  }, []);

  const handleAcceptInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Accepted');
      const updated = await api.getProjects();
      setProjects(updated);
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) { console.error(e); }
  };

  const handleRejectInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Rejected');
      const updated = await api.getProjects();
      setProjects(updated);
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) { console.error(e); }
  };

  const { myTasks, myInvitations, myEarnings, escrowed } = useMemo(() => {
    let tasks: MyTask[] = [];
    let invites: MyInvitation[] = [];
    let earnings = 0;
    let held = 0;

    if (!user) return { myTasks: [], myInvitations: [], myEarnings: 0, escrowed: 0 };

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

    return { myTasks: tasks, myInvitations: invites, myEarnings: earnings, escrowed: held };
  }, [projects, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10 bg-gray-50">
        <div className="text-center">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-[#0D1B2A]">يجب تسجيل الدخول أولاً</h2>
          <button onClick={() => navigate('/login')} className="mt-4 bg-[#0D1B2A] text-white px-8 py-3 rounded-xl font-bold">تسجيل الدخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden premium-bg font-sans" dir="rtl">
      {/* Dynamic Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-[#C9A84C]/5 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 60, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] bg-[#1A7F74]/5 rounded-full blur-[120px]" 
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Apple-Style Navigation Header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={APPLE_SPRINGS.soft}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#C9A84C] mb-4"
            >
              <Zap size={12} fill="currentColor" /> مركز التحكم المالي
            </motion.span>
            <h1 className="text-7xl font-black text-[#0D1B2A] tracking-tighter leading-none mb-4">
              لوحة المستقل
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3 space-x-reverse">
                <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-black text-xs">OA</div>
              </div>
              <p className="text-xl font-medium text-gray-400">
                مرحباً بك، <span className="text-[#0D1B2A] font-black">{user.name}</span>
              </p>
            </div>
          </div>

          <AppleGlassCard className="px-6 py-3 flex items-center gap-4 bg-white/40 border-white/60">
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">حالة الحساب</p>
                <p className="text-sm font-black text-emerald-600 flex items-center gap-1.5"><Shield size={14} /> موثق ومؤمن</p>
             </div>
             <div className="w-px h-8 bg-gray-200 mx-2" />
             <div className="w-10 h-10 rounded-full bg-[#0D1B2A] flex items-center justify-center text-white shadow-xl">
                <Star size={18} fill="#C9A84C" stroke="#C9A84C" />
             </div>
          </AppleGlassCard>
        </motion.header>

        {loading ? (
          <div className="py-20 text-center">
             <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0D1B2A] rounded-full animate-spin mx-auto mb-4" />
             <p className="text-gray-400 font-bold">جاري المزامنة مع الخزنة...</p>
          </div>
        ) : (
          <>
            {/* Hero Financials */}
            <div className="grid lg:grid-cols-3 gap-6 mb-16">
              <StatHeroCard label="إجمالي الأرباح" value={myEarnings} icon={<CheckCircle size={22} />} variant="success" />
              <StatHeroCard label="الخزنة (Escrow)" value={escrowed} icon={<motion.div animate={{ rotate: [0, 15, 0] }} transition={{ repeat: Infinity, duration: 4 }}><Lock size={22} /></motion.div>} variant="vault" />
              <StatHeroCard label="المهام المفتوحة" value={myTasks.filter(t => !t.paid).length} icon={<TrendingUp size={22} />} />
            </div>

            {/* Action Center: Invitations */}
            <AnimatePresence>
              {myInvitations.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-20"
                >
                  <div className="flex items-center justify-between mb-8 px-2">
                    <h2 className="text-3xl font-black text-[#0D1B2A] tracking-tight">دعوات العمل</h2>
                    <div className="px-4 py-2 glass rounded-full text-xs font-black text-red-500 flex items-center gap-2">
                       <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" /> {myInvitations.length} دعوات بانتظارك
                    </div>
                  </div>
                  <div className="grid gap-6">
                    {myInvitations.map(inv => (
                      <AppleGlassCard key={inv.id} className="p-8 border-blue-100/40 hover:border-blue-300 transition-colors">
                        <div className="flex flex-col lg:flex-row justify-between items-center gap-10">
                          <div className="flex-1">
                            <span className="inline-block px-3 py-1 rounded-lg bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-blue-500/30">فرصة مشروع جديد</span>
                            <h3 className="text-4xl font-black text-[#0D1B2A] mb-2 tracking-tighter">{inv.projectName}</h3>
                            <p className="text-xl font-medium text-gray-500 mb-8 flex items-center gap-3">
                              المهمة: <span className="text-[#0D1B2A] font-black">{inv.taskName}</span>
                              <span className="opacity-20">|</span>
                              <span className="flex items-center gap-1.5"><Users size={16} /> {inv.sender}</span>
                            </p>
                            <div className="flex gap-12">
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">الميزانية المقترحة</p>
                                <p className="text-3xl font-black text-[#1A7F74]">{formatCurrency(inv.budget)}</p>
                              </div>
                              <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">الموعد النهائي</p>
                                <p className="text-3xl font-black text-[#0D1B2A]">{inv.deadline}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-3 min-w-[240px]">
                            <motion.button 
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleAcceptInvite(inv)}
                              className="w-full bg-[#0D1B2A] text-white font-black py-5 rounded-2xl shadow-2xl shadow-[#0D1B2A]/20 text-lg transition-all"
                            >
                              قبول وبدء العمل
                            </motion.button>
                            <button 
                              onClick={() => setSelectedInvitation(inv)}
                              className="w-full bg-white/60 border border-gray-200 text-gray-900 font-bold py-4 rounded-2xl hover:bg-white transition-colors"
                            >
                              عرض التفاصيل
                            </button>
                          </div>
                        </div>
                      </AppleGlassCard>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            {/* Main Feed: Current Projects */}
            <section>
              <div className="flex items-center justify-between mb-10 px-2">
                <h2 className="text-3xl font-black text-[#0D1B2A] tracking-tight">المشاريع النشطة</h2>
              </div>

              {myTasks.length === 0 ? (
                <AppleGlassCard className="py-24 text-center border-dashed border-4 border-gray-200 bg-transparent shadow-none">
                  <div className="w-24 h-24 rounded-full bg-white/40 flex items-center justify-center mx-auto mb-8 shadow-inner">
                     <FileText size={40} className="text-gray-300" />
                  </div>
                  <p className="text-3xl font-black text-gray-400 tracking-tighter">لا توجد مشاريع حالية</p>
                  <p className="text-gray-400 font-medium mt-2">تصفح الدعوات أو انتظر تكليفك بمهمة جديدة</p>
                </AppleGlassCard>
              ) : (
                <div className="grid gap-8">
                  {myTasks.map(t => (
                    <AppleGlassCard 
                      key={t.id}
                      layoutId={`project-card-${t.projectId}`}
                      onClick={() => navigate(`/projects/${t.projectId}`)}
                      className="hover:border-[#C9A84C]/40"
                    >
                      <div className="flex flex-col lg:flex-row items-stretch">
                        <div className="p-8 flex-1 flex flex-col md:flex-row items-center gap-10">
                          <div className={cn(
                            "w-20 h-20 rounded-[2rem] flex items-center justify-center shrink-0 shadow-2xl transition-transform group-hover:rotate-12",
                            t.paid ? "bg-emerald-500 text-white" : "bg-blue-600 text-white"
                          )}>
                            {t.paid ? <CheckCircle size={36} /> : <Lock size={36} />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-4xl font-black text-[#0D1B2A] tracking-tighter group-hover:text-blue-600 transition-colors">{t.name}</h3>
                               {t.status === 'Disputed' && <span className="bg-red-500 text-white px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest">نزاع</span>}
                            </div>
                            <p className="text-2xl font-bold text-gray-400 mb-4">{t.projectName}</p>
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "px-4 py-1.5 rounded-full text-xs font-black border uppercase tracking-widest",
                                t.paid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                              )}>
                                {t.paid ? 'مكتمل ومدفوع' : 'قيد التنفيذ · مؤمن بكفيل'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-[#0D1B2A]/5 md:w-80 p-8 flex items-center justify-between border-t lg:border-t-0 lg:border-r border-white/40">
                          <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">المستحقات المالية</p>
                            <p className="text-4xl font-black text-[#0D1B2A] tracking-tighter">{formatCurrency(t.payment)}</p>
                          </div>
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-gray-300 group-hover:text-[#0D1B2A] group-hover:bg-[#C9A84C] transition-all shadow-xl group-hover:shadow-[#C9A84C]/40">
                            <ChevronLeft size={32} />
                          </div>
                        </div>
                      </div>
                    </AppleGlassCard>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Invitation Modal */}
      <AnimatePresence>
        {selectedInvitation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedInvitation(null)}
              className="absolute inset-0 bg-[#0D1B2A]/60 backdrop-blur-2xl" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              transition={APPLE_SPRINGS.standard}
              className="bg-[#F9F4EE] w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative z-10 border border-white/20" 
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-10 border-b border-[#E8DDD0] bg-[#F9F4EE]/90 backdrop-blur-xl">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">تفاصيل الدعوة</p>
                  <h2 className="text-5xl font-black text-[#0D1B2A] tracking-tighter">{selectedInvitation.projectName}</h2>
                </div>
                <button onClick={() => setSelectedInvitation(null)} className="w-14 h-14 rounded-3xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-all hover:rotate-90">
                  <X size={28} className="text-gray-400" />
                </button>
              </div>

              <div className="p-10 space-y-10">
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white border border-[#E8DDD0] p-8 rounded-[2rem] shadow-sm">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">المهمة الموكلة</p>
                    <p className="text-2xl font-black text-[#0D1B2A] tracking-tight">{selectedInvitation.taskName}</p>
                  </div>
                  <div className="bg-[#0D1B2A] p-8 rounded-[2rem] shadow-2xl shadow-[#0D1B2A]/30">
                    <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-2">الميزانية</p>
                    <p className="text-3xl font-black text-white tracking-tighter">{formatCurrency(selectedInvitation.budget)}</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-xl font-black text-[#0D1B2A] flex items-center gap-3">
                     <FileText size={24} className="text-[#C9A84C]" /> نبذة عن المشروع
                   </h3>
                   <div className="bg-white/50 border border-[#E8DDD0] p-8 rounded-[2.5rem] text-lg text-gray-600 leading-relaxed font-medium">
                      {selectedInvitation.description}
                   </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-black text-[#0D1B2A] flex items-center gap-3">
                     <CheckCircle size={24} className="text-emerald-500" /> المتطلبات والمهام
                  </h3>
                  <div className="grid gap-4">
                    {selectedInvitation.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-4 bg-white border border-[#E8DDD0] p-5 rounded-2xl">
                         <div className="w-3 h-3 bg-[#C9A84C] rounded-full shadow-lg shadow-[#C9A84C]/40" />
                         <span className="font-bold text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white/80 backdrop-blur-xl p-10 border-t border-[#E8DDD0] flex gap-6">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAcceptInvite(selectedInvitation)}
                  className="flex-[2] bg-[#1A7F74] text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-900/30 text-2xl"
                >
                  قبول المهمة والبدء
                </motion.button>
                <button 
                  onClick={() => handleRejectInvite(selectedInvitation)}
                  className="flex-1 bg-white border border-red-100 text-red-600 font-black rounded-[2rem] hover:bg-red-50 transition-colors text-xl"
                >
                  رفض
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
