import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Lock,
  CheckCircle,
  Briefcase,
  Wallet,
  Clock,
  AlertTriangle,
  Plus,
  ShieldCheck,
  TrendingUp,
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
import DemoButton from '@/shared/components/DemoButton';

// Mock data should be moved to API/Server in production. Keeping here for demo parity.
const MOCK_MILESTONES: Record<string, { name: string; status: 'done' | 'review' | 'upcoming' }[]> =
  {
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

const MOCK_SUBMISSION: Record<
  string,
  { by: string; milestone: string; files: string[]; date: string }
> = {
  proj_1: {
    by: 'Omar',
    milestone: 'تطوير الواجهة',
    files: ['frontend_build.zip', 'docs.pdf'],
    date: '12 يونيو 2026',
  },
};

const getAppScroller = () => document.getElementById('app-scroll-container') as HTMLElement | null;

const setAppScrollTop = (top: number) => {
  const scroller = getAppScroller();
  if (scroller) {
    scroller.scrollTop = top;
    return;
  }

  window.scrollTo({ top, behavior: 'auto' });
};

export default function ClientDashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [animatingProjectId, setAnimatingProjectId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<{ project: Project; task: Task } | null>(null);
  const [disputeTarget, setDisputeTarget] = useState<{ project: Project; task: Task } | null>(null);
  const containerRef = useRef(null);
  const routeTimerRef = useRef<number | null>(null);
  const location = useLocation();
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
      return (
        JSON.parse(localStorage.getItem('user') || 'null') || {
          role: 'client',
          username: 'ahmed_k',
          name: 'Ahmed Khaled',
          id: '1',
        }
      );
    } catch {
      return { role: 'client', username: 'ahmed_k', name: 'Ahmed Khaled', id: '1' };
    }
  }, []);

  const {
    data: projects = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['projects', user.username],
    queryFn: async () => {
      const data = await api.getProjects();
      return data.filter(
        (p) => !p.ownerUsername || p.ownerUsername === user.username || p.owner === user.name
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  const approveMutation = useMutation({
    mutationFn: ({ projectId, taskId }: { projectId: string; taskId: string }) =>
      api.completeTask(projectId, taskId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success(`✅ تم صرف الدفعة بنجاح!`);
      setApproveTarget(null);
    },
    onError: () => {
      toast.error('فشل في صرف الدفعة. يرجى المحاولة لاحقاً.');
    },
  });

  // Memoized derived state to prevent re-calculations on every render
  const { totalBudget, totalPaid, totalLocked, pendingApprovals } = useMemo(() => {
    let budget = 0;
    let paid = 0;
    let locked = 0;
    let pending = 0;

    projects.forEach((p) => {
      budget += p.budget;
      if (MOCK_SUBMISSION[p.id]) pending += 1;

      p.tasks.forEach((t) => {
        if (t.paid) paid += t.payment;
        else locked += t.payment;
      });
    });

    return { totalBudget: budget, totalPaid: paid, totalLocked: locked, pendingApprovals: pending };
  }, [projects]);

  useGSAP(
    () => {
      if (isLoading) return;

      gsap.fromTo(
        '.stat-card',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: 'power3.out' }
      );
    },
    { scope: containerRef, dependencies: [isLoading] }
  );

  const handleApproveClick = (projectId: string, taskId: string) => {
    const project = projects.find((p) => p.id === projectId);
    const task = project?.tasks.find((t) => t.id === taskId);
    if (project && task) setApproveTarget({ project, task });
  };

  const handleOpenProjectDetails = (projectId: string) => {
    // Save scroll position immediately
    const scroller = getAppScroller();
    const scrollTop = scroller ? scroller.scrollTop : window.scrollY;
    try {
      sessionStorage.setItem(`scroll:${location.pathname}`, scrollTop.toString());
      sessionStorage.setItem('scroll:skip-next-save', location.pathname);
    } catch (e) {
      // ignore
    }

    setAnimatingProjectId(projectId);

    if (routeTimerRef.current) {
      window.clearTimeout(routeTimerRef.current);
    }

    // Delay for cinematic expansion effect
    routeTimerRef.current = window.setTimeout(() => {
      setAppScrollTop(0);
      navigate(`/projects/${projectId}`);
    }, 1000); 
  };

  if (isError) {
    return (
      <div
        className="flex min-h-[50vh] flex-col items-center justify-center text-center"
        role="alert"
      >
        <AlertTriangle size={48} className="mb-4 text-red-500" aria-hidden="true" />
        <h2 className="text-xl font-bold text-[var(--color-kafil-midnight)]">
          عذراً، حدث خطأ أثناء تحميل البيانات
        </h2>
        <p className="mt-2 mb-6 text-gray-500">يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً.</p>
        <button onClick={() => window.location.reload()} className="btn-gold">
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <main
      ref={containerRef}
      className="animate-fade-in relative mx-auto max-w-6xl space-y-10 focus:outline-none"
      dir="rtl"
      tabIndex={-1}
    >
      <AnimatePresence>
        {animatingProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm"
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeInOut' }}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-1 text-3xl font-black tracking-tight text-[var(--color-kafil-midnight)]">
            الخزنة المركزية
          </h1>
          <p className="font-medium text-gray-500">
            أهلاً {user.name}! تابع استثماراتك المالية في مشاريعك بأقصى درجات الأمان.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden w-56 md:block">
            <DemoButton />
          </div>
          <motion.button
            layoutId="create-project-btn"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex shrink-0 items-center gap-2 rounded-2xl bg-[var(--color-kafil-midnight)] px-6 py-3.5 font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-xl focus:ring-4 focus:ring-[var(--color-kafil-gold)] focus:outline-none"
            style={{ boxShadow: '0 4px 20px rgba(13,27,42,0.25)' }}
          >
            <Plus size={18} aria-hidden="true" /> إطلاق مشروع جديد
          </motion.button>
        </div>
      </header>

      {isLoading ? (
        // Skeleton Loading State
        <div className="space-y-10" aria-busy="true" aria-label="جاري تحميل المشاريع">
          <div className="grid gap-4 md:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-3xl border border-[var(--color-kafil-sand)] bg-white/50"
              />
            ))}
          </div>
          <div className="h-40 animate-pulse rounded-3xl border border-[var(--color-kafil-sand)] bg-white/50" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <section className="grid gap-5 md:grid-cols-4" aria-label="إحصائيات الخزنة">
            <div className="stat-card relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-kafil-sand)] bg-white p-6 shadow-sm">
              <div className="absolute top-0 left-0 h-full w-1 border-l-4 border-gray-100"></div>
              <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Briefcase size={16} /> إجمالي الميزانيات
              </p>
              <p className="text-4xl font-black text-[var(--color-kafil-midnight)]">
                {formatCurrency(totalBudget)}
              </p>
            </div>

            <div className="stat-card relative z-10 flex h-36 scale-100 transform flex-col justify-between overflow-hidden rounded-3xl bg-[var(--color-kafil-midnight)] p-6 shadow-lg md:scale-105">
              <div className="absolute top-0 right-0 -z-10 h-32 w-32 rounded-full bg-blue-800 opacity-20 blur-2xl"></div>
              <p className="flex items-center gap-2 text-[10px] font-black text-[var(--color-kafil-gold)] uppercase tracking-widest">
                <Lock size={16} /> في الضمان (Escrow)
              </p>
              <p className="text-4xl font-black text-white">{formatCurrency(totalLocked)}</p>
            </div>

            <div className="stat-card relative flex h-36 flex-col justify-between overflow-hidden rounded-3xl border border-[var(--color-kafil-sand)] bg-white p-6 shadow-sm">
              <div className="absolute top-0 right-0 h-full w-1 bg-emerald-500"></div>
              <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <CheckCircle size={16} className="text-emerald-500" /> المدفوعات المحررة
              </p>
              <p className="text-4xl font-black text-[var(--color-kafil-midnight)]">
                {formatCurrency(totalPaid)}
              </p>
            </div>

            <div
              className={`stat-card flex h-36 flex-col justify-between overflow-hidden rounded-3xl border p-6 shadow-sm ${pendingApprovals > 0 ? 'border-amber-200 bg-amber-50' : 'border-[var(--color-kafil-sand)] bg-white'}`}
            >
              <p className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <Clock
                  size={16}
                  className={pendingApprovals > 0 ? 'text-amber-600' : 'text-gray-400'}
                />{' '}
                انتظار الاعتماد
              </p>
              <p
                className={`text-4xl font-black ${pendingApprovals > 0 ? 'text-amber-700' : 'text-[var(--color-kafil-midnight)]'}`}
              >
                {pendingApprovals}
              </p>
            </div>
          </section>

          {/* Budget Flow Visualizer */}
          <section
            className="budget-flow rounded-[2.5rem] border border-[var(--color-kafil-sand)] bg-white p-10 shadow-sm"
            aria-labelledby="budget-flow-title"
          >
            <h2
              id="budget-flow-title"
              className="mb-10 flex items-center gap-3 text-xl font-black text-[var(--color-kafil-midnight)]"
            >
              <Wallet size={24} className="text-[var(--color-kafil-gold)]" aria-hidden="true" />{' '}
              تدفق مسار المدفوعات
            </h2>
            <div
              className="relative mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 md:flex-row"
              aria-hidden="true"
            >
              <div className="absolute top-1/2 right-8 left-8 -z-10 mt-[-2px] hidden h-1 bg-gray-100 md:block"></div>
              
              <div className="z-10 min-w-[160px] rounded-2xl border border-[var(--color-kafil-sand)] bg-gray-50 px-8 py-6 text-center shadow-sm">
                <p className="mb-2 text-xs font-bold text-gray-400">رأس المال</p>
                <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">
                  {formatCurrency(totalBudget)}
                </p>
              </div>

              <TrendingUp size={24} className="hidden rotate-180 text-gray-200 md:block" />

              <div className="z-10 min-w-[200px] scale-105 rounded-2xl border-2 border-[var(--color-kafil-gold)] bg-[var(--color-kafil-gold)]/5 px-8 py-6 text-center shadow-lg shadow-[var(--color-kafil-gold)]/10">
                <p className="mb-2 flex items-center justify-center gap-1 text-xs font-bold text-[var(--color-kafil-gold)]">
                  <Lock size={12} /> قيد الاحتجاز (Escrow)
                </p>
                <p className="text-3xl font-black text-[var(--color-kafil-midnight)]">
                  {formatCurrency(totalLocked)}
                </p>
              </div>

              <TrendingUp size={24} className="hidden rotate-180 text-gray-200 md:block" />

              <div className="z-10 min-w-[160px] rounded-2xl border border-emerald-200 bg-emerald-50 px-8 py-6 text-center shadow-sm">
                <p className="mb-2 text-xs font-bold text-emerald-600">مصروفة للمستقلين</p>
                <p className="text-2xl font-black text-emerald-700">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </section>

          {/* Projects */}
          <section className="space-y-6" aria-labelledby="projects-title">
            <div className="flex items-center justify-between px-2">
              <h2
                id="projects-title"
                className="text-2xl font-black text-[var(--color-kafil-midnight)]"
              >
                مشاريعك قيد التنفيذ ({projects.length})
              </h2>
              {pendingApprovals > 0 && (
                <div
                  className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-bold text-amber-700 shadow-sm"
                  role="status"
                >
                  <AlertTriangle size={14} aria-hidden="true" /> {pendingApprovals} تسليم يحتاج
                  اعتمادك
                </div>
              )}
            </div>

            {projects.length === 0 ? (
              <div className="rounded-[3rem] border-2 border-dashed border-[var(--color-kafil-sand)] bg-white p-20 text-center shadow-sm">
                <ShieldCheck size={64} className="mx-auto mb-6 text-gray-100" aria-hidden="true" />
                <p className="mb-6 text-xl font-bold text-gray-400">لا توجد مشاريع ممولة حالياً.</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-kafil-gold)] px-8 py-4 font-black text-[var(--color-kafil-midnight)] shadow-xl shadow-[var(--color-kafil-gold)]/20 transition hover:-translate-y-1"
                >
                  ابدأ بتمويل مشروعك الأول <Plus size={20} />
                </button>
              </div>
            ) : (
              <div className="relative grid gap-6 lg:grid-cols-2" role="list">
                {projects.map((p) => (
                  <ProjectCard
                    key={p.id}
                    p={p}
                    milestones={MOCK_MILESTONES[p.id] || []}
                    submission={MOCK_SUBMISSION[p.id] || null}
                    onApprove={handleApproveClick}
                    onDispute={(proj, task) => setDisputeTarget({ project: proj, task })}
                    onViewDetails={() => handleOpenProjectDetails(p.id)}
                    isOpening={animatingProjectId === p.id}
                    isDimming={Boolean(animatingProjectId) && animatingProjectId !== p.id}
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
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-[rgba(13,27,42,0.12)] backdrop-blur-[3px]"
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
            onConfirm={() =>
              approveMutation.mutate({
                projectId: approveTarget.project.id,
                taskId: approveTarget.task.id,
              })
            }
          />
        )}
      </AnimatePresence>

      {/* Dispute Modal */}
      <AnimatePresence>
        {disputeTarget && (
          <DisputeModal target={disputeTarget} onClose={() => setDisputeTarget(null)} />
        )}
      </AnimatePresence>

      {/* Create Project Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <CreateProjectModal user={user} onClose={() => setIsCreateModalOpen(false)} />
        )}
      </AnimatePresence>
    </main>
  );
}
