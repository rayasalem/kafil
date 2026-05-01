import { useEffect, useState, FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Lock, CheckCircle, Upload, Send, X, Users, TrendingUp, 
  FileText, ChevronLeft, Star, Shield, AlertCircle, Clock 
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, User, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

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

/* ─── Components ─── */

const GlassCard: FC<{ children: React.ReactNode; className?: string; layoutId?: string }> = ({ children, className, layoutId }) => (
  <motion.div
    layoutId={layoutId}
    className={cn(
      "relative overflow-hidden bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl rounded-[2rem]",
      className
    )}
  >
    {children}
  </motion.div>
);

const AnimatedNumber: FC<{ value: number }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * (end - start) + start);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{formatCurrency(displayValue)}</span>;
};

const StatCard: FC<{ label: string; value: number; icon: React.ReactNode; variant?: 'default' | 'vault' | 'success' }> = ({ label, value, icon, variant = 'default' }) => {
  const variants = {
    default: "bg-white/80 border-white/40 text-[#0D1B2A]",
    vault: "bg-[#0D1B2A] text-white border-transparent",
    success: "bg-emerald-50/80 border-emerald-100 text-emerald-900",
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={cn("p-6 rounded-[2.5rem] border shadow-sm flex flex-col justify-between h-40", variants[variant])}
    >
      <div className="flex items-center justify-between">
        <p className={cn("text-xs font-black uppercase tracking-widest opacity-60", variant === 'vault' ? 'text-blue-200' : 'text-gray-500')}>
          {label}
        </p>
        <div className={cn("p-2 rounded-2xl", variant === 'vault' ? 'bg-white/10' : 'bg-gray-100/50')}>
          {icon}
        </div>
      </div>
      <p className="text-4xl font-black">
        <AnimatedNumber value={value} />
      </p>
    </motion.div>
  );
};

export default function FreelancerDashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvitation, setSelectedInvitation] = useState<MyInvitation | null>(null);

  // Use the API to get the user for consistency
  const user: User | null = api.getCurrentUser() || JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    setLoading(true);
    api.getProjects().then(data => {
      console.log('Dashboard Data Loaded:', data);
      setProjects(data);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load projects:', err);
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

  // Memoize data processing to prevent flickering and ensure accuracy
  const { myTasks, myInvitations, myEarnings, escrowed } = useMemo(() => {
    let tasks: MyTask[] = [];
    let invites: MyInvitation[] = [];
    let earnings = 0;
    let held = 0;

    if (!user) return { myTasks: [], myInvitations: [], myEarnings: 0, escrowed: 0 };

    projects.forEach(p => {
      p.tasks.forEach(t => {
        // Robust Matching
        const isMatch = 
          t.assignedTo === user.id || 
          (user.email && t.assignedToEmail?.toLowerCase() === user.email.toLowerCase()) ||
          t.assignedTo === user.username;

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto px-4 py-8" 
      dir="rtl"
    >
      {/* Premium Header */}
      <motion.div variants={itemVariants} className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black text-[#0D1B2A] tracking-tighter mb-2">
            لوحة التحكم
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-gray-400 font-medium text-lg">
              مرحباً <span className="text-[#0D1B2A] font-bold">{user.name}</span>
            </p>
            <span className="opacity-30 hidden md:block">|</span>
            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-black border border-emerald-100 flex items-center gap-1.5 shadow-sm">
              <Shield size={14} /> حساب مؤمن بالكامل
            </span>
          </div>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-3 bg-white border border-[#E8DDD0] pl-6 pr-4 py-3 rounded-2xl shadow-sm self-stretch md:self-auto"
        >
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مستوى الموثوقية</p>
            <p className="text-sm font-black text-[#0D1B2A]">مستقل موثوق</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#C9A84C] flex items-center justify-center text-white shadow-lg shadow-[#C9A84C]/20">
            <Star size={20} fill="currentColor" />
          </div>
        </motion.div>
      </motion.div>

      {loading ? (
        <div className="py-20 text-center">
           <div className="w-12 h-12 border-4 border-gray-200 border-t-[#0D1B2A] rounded-full animate-spin mx-auto mb-4" />
           <p className="text-gray-400 font-bold">جاري تحميل بياناتك المالية...</p>
        </div>
      ) : (
        <>
          {/* Stats - The Financial Core */}
          <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 mb-12">
            <StatCard 
              label="الأرباح المستلمة" 
              value={myEarnings} 
              icon={<CheckCircle className="text-emerald-500" size={20} />} 
              variant="success"
            />
            <StatCard 
              label="محجوز في كفيل (الخزنة)" 
              value={escrowed} 
              icon={<motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}><Lock className="text-blue-300" size={20} /></motion.div>} 
              variant="vault"
            />
            <StatCard 
              label="المهام النشطة" 
              value={myTasks.filter(t => !t.paid).length} 
              icon={<TrendingUp className="text-[#C9A84C]" size={20} />} 
            />
          </motion.div>

          {/* Invitations */}
          <AnimatePresence>
            {myInvitations.length > 0 && (
              <motion.div 
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, height: 0 }}
                className="mb-12"
              >
                <h2 className="text-2xl font-black mb-6 text-[#0D1B2A] flex items-center gap-3">
                  <span className="flex h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  دعوات العمل الجديدة
                  <span className="text-sm font-medium text-gray-400 bg-gray-100 px-3 py-1 rounded-full">({myInvitations.length})</span>
                </h2>
                <div className="grid gap-6">
                  {myInvitations.map(inv => (
                    <GlassCard key={inv.id} className="p-1 group border-blue-100/50">
                      <div className="p-8 flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-blue-500/20">فرصة ذهبية</span>
                            <span className="text-sm text-gray-500 font-bold flex items-center gap-2">
                              <Users size={14} className="text-gray-400" /> {inv.sender}
                            </span>
                          </div>
                          <h3 className="text-3xl font-black text-[#0D1B2A] mb-2">{inv.projectName}</h3>
                          <p className="text-gray-500 font-medium mb-6 flex items-center gap-2">المهمة المطلوبة: <span className="text-[#0D1B2A] font-black">{inv.taskName}</span></p>
                          
                          <div className="flex gap-10">
                            <div className="bg-white/50 p-4 rounded-2xl border border-white">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">الميزانية</p>
                              <p className="text-2xl font-black text-[#1A7F74]">{formatCurrency(inv.budget)}</p>
                            </div>
                            <div className="bg-white/50 p-4 rounded-2xl border border-white">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">الموعد</p>
                              <p className="text-2xl font-black text-[#0D1B2A]">{inv.deadline}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-center gap-3 min-w-[200px]">
                          <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAcceptInvite(inv)}
                            className="w-full bg-[#0D1B2A] text-white font-black py-4 rounded-2xl shadow-2xl shadow-[#0D1B2A]/20 transition-all text-lg"
                          >
                            قبول المهمة فوراً
                          </motion.button>
                          <button 
                            onClick={() => setSelectedInvitation(inv)}
                            className="w-full bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-2xl hover:bg-gray-50 transition-colors"
                          >
                            التفاصيل الكاملة
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Tasks */}
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-black mb-6 text-[#0D1B2A]">
              المشاريع الحالية
              <span className="text-sm font-medium text-gray-400 mr-3 font-bold">({myTasks.length} مهام)</span>
            </h2>

            {myTasks.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-md border-4 border-dashed border-[#E8DDD0] rounded-[3rem] p-24 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-400 font-black text-2xl">لا توجد مهام نشطة حالياً.</p>
                <p className="text-gray-400 mt-2">تصفح المشاريع المتاحة للبدء في تحقيق الأرباح.</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {myTasks.map(t => (
                  <motion.button
                    key={t.id}
                    layoutId={`project-card-${t.projectId}`}
                    onClick={() => navigate(`/projects/${t.projectId}`)}
                    whileHover={{ y: -5, scale: 1.01 }}
                    className="w-full text-right bg-white/70 backdrop-blur-xl border border-white/40 p-1.5 rounded-[2.5rem] shadow-xl shadow-gray-200/50 group flex flex-col md:flex-row items-stretch"
                  >
                    <div className="p-6 flex-1 flex flex-col md:flex-row items-center gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-inner",
                        t.paid ? "bg-emerald-100/50 text-emerald-600" : "bg-blue-100/50 text-blue-600"
                      )}>
                        {t.paid ? <CheckCircle size={32} /> : <motion.div animate={{ rotate: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Lock size={32} /></motion.div>}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-black text-2xl text-[#0D1B2A] group-hover:text-blue-600 transition-colors">{t.name}</h3>
                        <p className="text-gray-400 font-bold text-lg mb-2">{t.projectName}</p>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-black border",
                            t.paid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-blue-50 text-blue-600 border-blue-100"
                          )}>
                            {t.paid ? 'مكتمل ومدفوع' : 'قيد التنفيذ - الأموال محجوزة'}
                          </span>
                          {t.status === 'Disputed' && <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-black">نزاع مفتوح</span>}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 md:w-64 p-6 md:border-r border-white/40 flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">المستحقات</p>
                        <p className="text-3xl font-black text-[#0D1B2A]">{formatCurrency(t.payment)}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-300 group-hover:text-blue-600 group-hover:border-blue-200 transition-all shadow-sm">
                        <ChevronLeft size={24} />
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* Invitation Detail Modal */}
      <AnimatePresence>
        {selectedInvitation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInvitation(null)}
              className="absolute inset-0 bg-[#0D1B2A]/40 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#F9F4EE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl relative z-10" 
            >
              <div className="sticky top-0 z-10 flex items-center justify-between p-8 border-b border-[#E8DDD0] bg-[#F9F4EE]/80 backdrop-blur-lg">
                <div>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">مراجعة عرض العمل</p>
                  <h2 className="text-3xl font-black text-[#0D1B2A]">{selectedInvitation.projectName}</h2>
                </div>
                <button onClick={() => setSelectedInvitation(null)} className="w-12 h-12 rounded-2xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all">
                  <X size={24} className="text-gray-400" />
                </button>
              </div>

              <div className="p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">المهمة</p>
                    <p className="text-xl font-black text-[#0D1B2A]">{selectedInvitation.taskName}</p>
                  </div>
                  <div className="bg-[#0D1B2A] p-6 rounded-3xl shadow-xl shadow-[#0D1B2A]/20">
                    <p className="text-[10px] font-black text-blue-200 uppercase mb-2">الميزانية</p>
                    <p className="text-2xl font-black text-white">{formatCurrency(selectedInvitation.budget)}</p>
                  </div>
                </div>

                <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl">
                  <h3 className="font-black text-[#0D1B2A] mb-4 flex items-center gap-2 text-lg">
                    <FileText size={20} className="text-[#C9A84C]" /> وصف المشروع
                  </h3>
                  <p className="text-gray-600 leading-relaxed font-medium">
                    {selectedInvitation.description}
                  </p>
                </div>

                <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl">
                  <h3 className="font-black text-[#0D1B2A] mb-4 flex items-center gap-2 text-lg">
                    <CheckCircle size={20} className="text-emerald-500" /> المتطلبات الأساسية
                  </h3>
                  <ul className="space-y-3">
                    {selectedInvitation.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-gray-700 font-bold">
                        <div className="w-2 h-2 bg-[#C9A84C] rounded-full shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-8 border-t border-[#E8DDD0] flex gap-4">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAcceptInvite(selectedInvitation)}
                  className="flex-1 bg-[#1A7F74] text-white font-black py-5 rounded-2xl shadow-xl shadow-emerald-900/20 text-xl"
                >
                  قبول والبدء فوراً
                </motion.button>
                <button 
                  onClick={() => handleRejectInvite(selectedInvitation)}
                  className="px-8 py-5 bg-white border border-red-200 text-red-600 font-black rounded-2xl hover:bg-red-50 transition-colors"
                >
                  اعتذار
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
