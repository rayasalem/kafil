import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Lock, CheckCircle, Briefcase, Wallet, Clock, AlertTriangle, Plus, ShieldCheck, TrendingUp
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, Task, User } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Components
import { DisputeModal } from './components/ClientDashboard/DisputeModal';
import { ApproveModal } from './components/ClientDashboard/ApproveModal';
import { ProjectCard } from './components/ClientDashboard/ProjectCard';
import { CreateProjectModal } from './components/ClientDashboard/CreateProjectModal';

// Mock data should be moved to API/Server in production. Keeping here for demo parity.
const MOCK_MILESTONES: Record<string, { name: string; status: 'done' | 'review' | 'upcoming' }[]> = {
  proj_1: [
    { name: 'تصميم الواجهات', status: 'done' },
    { name: 'تطوير الواجهة', status: 'review' },
    { name: 'الخادم والـ API', status: 'upcoming' },
    { name: 'الاختبار والإطلاق', status: 'upcoming' },
  ],
  proj_2: [
    { name: 'رسوم هيكلية', status: 'done' },
    { name: 'التطوير الكامل', status: 'review' },
    { name: 'الاختبار', status: 'upcoming' },
  ],
};

const MOCK_SUBMISSION: Record<string, { by: string; milestone: string; files: string[]; date: string }> = {
  proj_1: { by: 'Omar', milestone: 'تطوير الواجهة', files: ['frontend_build.zip', 'docs.pdf'], date: '12 يونيو 2026' },
};

export default function ClientDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [openingProjectId, setOpeningProjectId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<{ project: Project; task: Task } | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<{ project: Project; task: Task } | null>(null);
  const containerRef = useRef(null);
  const routeTimerRef = useRef<number | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    return () => {
      if (routeTimerRef.current) {
        window.clearTimeout(routeTimerRef.current);
      }
    };
  }, []);

  // In production, use a dedicated useAuth() hook.
  const user = useMemo<User>(() => {
    try {
      return JSON.parse(localStorage.getItem('user') || 'null') || { role: 'client', username: 'ahmed_k', name: 'Ahmed Khaled', id: '1' };
    } catch {
      return { role: 'client', username: 'ahmed_k', name: 'Ahmed Khaled', id: '1' };
    }
  }, []);

  const { data: projects = [], isLoading, isError } = useQuery({
    queryKey: ['projects', user.username],
    queryFn: async () => {
      const data = await api.getProjects();
      return data.filter(p => !p.ownerUsername || p.ownerUsername === user.username || p.owner === user.name);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const approveMutation = useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) => api.completeTask(projectId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`✅ تم صرف الدفعة بنجاح!`);
      setApproveTarget(null);
    },
    onError: () => {
      toast.error('فشل في صرف الدفعة. يرجى المحاولة لاحقاً.');
    }
  });

  // Memoized derived state to prevent re-calculations on every render
  const { totalBudget, totalPaid, totalLocked, pendingApprovals } = useMemo(() => {
    let budget = 0;
    let paid = 0;
    let locked = 0;
    let pending = 0;

    projects.forEach(p => {
      budget += p.budget;
      if (MOCK_SUBMISSION[p.id]) pending += 1;
      
      p.tasks.forEach(t => {
        if (t.paid) paid += t.payment;
        else locked += t.payment;
      });
    });

    return { totalBudget: budget, totalPaid: paid, totalLocked: locked, pendingApprovals: pending };
  }, [projects]);

  useGSAP(() => {
    if (isLoading) return;
    
    gsap.fromTo('.stat-card', 
      { y: 30, opacity: 0 }, 
      { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
    );
    gsap.fromTo('.budget-flow',
      { scale: 0.95, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.4 }
    );
  }, { scope: containerRef, dependencies: [isLoading] });

  const handleApproveClick = (projectId: string, taskId: string) => {
    const project = projects.find(p => p.id === projectId);
    const task = project?.tasks.find(t => t.id === taskId);
    if (project && task) setApproveTarget({ project, task });
  };

  const handleOpenProjectDetails = (projectId: string) => {
    setOpeningProjectId(projectId);

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
    }

    routeTimerRef.current = window.setTimeout(() => {
      navigate(`/projects/${projectId}`);
    }, 850);
  };

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center" role="alert">
        <AlertTriangle size={48} className="text-red-500 mb-4" aria-hidden="true" />
        <h2 className="text-xl font-bold text-[var(--color-kafil-midnight)]">عذراً، حدث خطأ أثناء تحميل البيانات</h2>
        <p className="text-gray-500 mt-2 mb-6">يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
        <button onClick={() => window.location.reload()} className="btn-gold">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <main ref={containerRef} className="animate-fade-in max-w-6xl mx-auto space-y-10 focus:outline-none" dir="rtl" tabIndex={-1}>
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[var(--color-kafil-midnight)] tracking-tight mb-1">الخزنة المركزية</h1>
          <p className="text-gray-500 font-medium">أهلاً {user.name}! جميع أموالك محمية تحت نظام الضمان.</p>
        </div>
        <motion.button
          layoutId="create-project-btn"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 font-black px-6 py-3.5 rounded-2xl text-white transition-all hover:-translate-y-0.5 hover:shadow-xl shrink-0 bg-[var(--color-kafil-midnight)] focus:outline-none focus:ring-4 focus:ring-[var(--color-kafil-gold)]"
          style={{ boxShadow: '0 4px 20px rgba(13,27,42,0.25)' }}
        >
          <Plus size={18} aria-hidden="true" /> إطلاق مشروع جديد
        </motion.button>
      </header>

      {isLoading ? (
        // Skeleton Loading State
        <div className="space-y-10" aria-busy="true" aria-label="جاري تحميل المشاريع">
          <div className="grid md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-white/50 border border-[var(--color-kafil-sand)] rounded-3xl animate-pulse" />
            ))}
          </div>
          <div className="h-40 bg-white/50 border border-[var(--color-kafil-sand)] rounded-3xl animate-pulse" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <section className="grid md:grid-cols-4 gap-4" aria-label="إحصائيات الخزنة">
            <div className="stat-card bg-white border border-[var(--color-kafil-sand)] p-6 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-kafil-sand)]" aria-hidden="true">
                <Briefcase size={22} className="text-[var(--color-kafil-midnight)]" />
              </div>
              <div>
                <h2 className="text-[10px] font-black text-gray-400 uppercase m-0">إجمالي الميزانيات</h2>
                <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(totalBudget)}</p>
              </div>
            </div>

            <div className="stat-card p-6 rounded-3xl flex items-center gap-4 shadow-lg bg-[var(--color-kafil-midnight)]">
              <div className="bg-white/10 p-3 rounded-xl" aria-hidden="true">
                <Lock size={22} className="text-[var(--color-kafil-gold)]" />
              </div>
              <div>
                <h2 className="text-[10px] font-black text-blue-200/60 uppercase m-0">في الضمان (Escrow)</h2>
                <p className="text-2xl font-black text-white">{formatCurrency(totalLocked)}</p>
              </div>
            </div>

            <div className="stat-card bg-white border border-[var(--color-kafil-sand)] p-6 rounded-3xl flex items-center gap-4 shadow-sm">
              <div className="bg-emerald-50 p-3 rounded-xl" aria-hidden="true">
                <CheckCircle size={22} className="text-emerald-600" />
              </div>
              <div>
                <h2 className="text-[10px] font-black text-gray-400 uppercase m-0">المدفوعات المحررة</h2>
                <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(totalPaid)}</p>
              </div>
            </div>

            <div className={`stat-card p-6 rounded-3xl flex items-center gap-4 shadow-sm border ${pendingApprovals > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-[var(--color-kafil-sand)]'}`}>
              <div className={`p-3 rounded-xl ${pendingApprovals > 0 ? 'bg-amber-100' : 'bg-gray-50'}`} aria-hidden="true">
                <Clock size={22} className={pendingApprovals > 0 ? 'text-amber-600' : 'text-gray-400'} />
              </div>
              <div>
                <h2 className="text-[10px] font-black text-gray-400 uppercase m-0">تسليمات بانتظار الاعتماد</h2>
                <p className={`text-2xl font-black ${pendingApprovals > 0 ? 'text-amber-700' : 'text-[var(--color-kafil-midnight)]'}`}>{pendingApprovals}</p>
              </div>
            </div>
          </section>

          {/* Budget Flow Visualizer */}
          <section className="budget-flow bg-white border border-[var(--color-kafil-sand)] p-7 rounded-3xl shadow-sm" aria-labelledby="budget-flow-title">
            <h2 id="budget-flow-title" className="text-base font-black text-[var(--color-kafil-midnight)] mb-5 flex items-center gap-2">
              <Wallet size={18} className="text-[var(--color-kafil-gold)]" aria-hidden="true" /> مسار ميزانيتك
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-2xl mx-auto" aria-hidden="true">
              <div className="text-center bg-gray-50 border border-[var(--color-kafil-sand)] px-8 py-5 rounded-2xl min-w-[130px]">
                <p className="text-xs font-bold text-gray-400 mb-1">رأس المال</p>
                <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(totalBudget)}</p>
              </div>
              <TrendingUp size={20} className="text-gray-200 hidden md:block rotate-180" />
              <div className="text-center border-2 border-[var(--color-kafil-gold)] bg-[var(--color-kafil-gold)]/5 px-8 py-5 rounded-2xl scale-105 min-w-[150px]">
                <p className="text-xs font-bold text-[var(--color-kafil-gold)] mb-1 flex items-center gap-1 justify-center"><Lock size={10} /> في الضمان</p>
                <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(totalLocked)}</p>
              </div>
              <TrendingUp size={20} className="text-gray-200 hidden md:block rotate-180" />
              <div className="text-center bg-emerald-50 border border-emerald-200 px-8 py-5 rounded-2xl min-w-[130px]">
                <p className="text-xs font-bold text-emerald-600 mb-1">صُرف للمستقلين</p>
                <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-5" aria-labelledby="projects-title">
            <div className="flex items-center justify-between">
              <h2 id="projects-title" className="text-xl font-bold text-[var(--color-kafil-midnight)]">مشاريعك قيد التنفيذ ({projects.length})</h2>
              {pendingApprovals > 0 && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full" role="status">
                  <AlertTriangle size={12} aria-hidden="true" /> {pendingApprovals} تسليم يحتاج اعتمادك
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="bg-white border-2 border-dashed border-[var(--color-kafil-sand)] rounded-3xl p-16 text-center">
                <ShieldCheck size={48} className="mx-auto text-gray-200 mb-4" aria-hidden="true" />
                <p className="text-gray-400 font-bold text-lg mb-2">لا توجد مشاريع بعد.</p>
                <button onClick={() => setIsCreateModalOpen(true)} className="text-[var(--color-kafil-gold)] font-bold hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-kafil-gold)]">ابدأ بإنشاء مشروعك الأول</button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 gap-6" role="list">
                {projects.map(p => (
                  <ProjectCard 
                    key={p.id} 
                    p={p} 
                    milestones={MOCK_MILESTONES[p.id] || []}
                    submission={MOCK_SUBMISSION[p.id] || null}
                    onApprove={handleApproveClick} 
                    onDispute={(proj, task) => setDisputeTarget({ project: proj, task })} 
                    onViewDetails={() => handleOpenProjectDetails(p.id)}
                    isOpening={openingProjectId === p.id}
                    isDimming={Boolean(openingProjectId) && openingProjectId !== p.id}
                  />
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <AnimatePresence>
        {openingProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[rgba(13,27,42,0.22)] backdrop-blur-[6px]"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Approve Modal */}
      <AnimatePresence>
        {approveTarget && (
          <ApproveModal
            project={approveTarget.project}
            task={approveTarget.task}
            submission={MOCK_SUBMISSION[approveTarget.project.id] || null}
            onClose={() => setApproveTarget(null)}
            onConfirm={() => approveMutation.mutate({ projectId: approveTarget.project.id, taskId: approveTarget.task.id })}
          />
        )}
      </AnimatePresence>

      {/* Dispute Modal */}
      <AnimatePresence>
        {disputeTarget && (
          <DisputeModal
            target={disputeTarget}
            onClose={() => setDisputeTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateProjectModal 
            user={user} 
            onClose={() => setIsCreateModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}
