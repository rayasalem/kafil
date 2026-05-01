import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Send, Gavel, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

import { AppleCloseButton } from '@/shared/components/ui/AppleCloseButton';
import MoneyFlowBar from '@/features/escrow/MoneyFlowBar';
import { formatCurrency } from '@/shared/utils/format';
import { useAuth } from '@/shared/hooks/useAuth';

import { useProjectDetails } from './hooks/useProjectDetails';
import { TaskRow } from './components/TaskRow';
import { DisputeModal } from './components/DisputeModal';
import { TaskDetailsModal } from './components/TaskDetailsModal';

const ProjectDetailsView: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { project, form, modals, stats, actions } = useProjectDetails(id);

  if (!project) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#E8DDD0] border-t-[#C9A84C]" />
        <p className="font-bold text-gray-400">جاري تحميل الخزنة...</p>
      </div>
    );
  }

  const userRole = user?.role || 'client';

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-6 left-6 z-[60]">
        <AppleCloseButton onClick={() => navigate(-1)} />
      </div>

      <motion.div
        layoutId={`project-card-${id}`}
        initial={false}
        transition={{ layout: { type: 'spring', stiffness: 180, damping: 22, mass: 0.9 } }}
        className="relative z-50 mx-auto mb-10 max-w-5xl overflow-hidden rounded-[28px] bg-white shadow-2xl"
        dir="rtl"
      >
        {/* Header Section */}
        <div className="border-b border-[#E8DDD0] bg-white p-8">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 pl-12 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-extrabold tracking-tight text-[#0D1B2A]">
                  {project.title}
                </h1>
                <span className="flex items-center gap-1 rounded-full border border-[#C9A84C]/30 bg-[#C9A84C]/10 px-3 py-1.5 text-xs font-black text-[#C9A84C]">
                  <Lock size={12} /> الأموال محفوظة في كفيل
                </span>
                {stats.openDisputesCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-black text-red-600">
                    <Gavel size={12} /> {stats.openDisputesCount} نزاع مفتوح
                  </span>
                )}
              </div>
              <p className="font-medium text-gray-400">
                المدير: <span className="text-gray-600">{project.owner}</span>
              </p>
            </div>
            <div className="min-w-[200px] rounded-2xl bg-[#0D1B2A] p-5 text-right">
              <span className="mb-1 block text-xs font-black tracking-widest text-blue-200/60 uppercase">
                الميزانية الإجمالية
              </span>
              <span className="block text-4xl font-black tracking-tight text-white">
                {formatCurrency(project.budget)}
              </span>
            </div>
          </div>
          <MoneyFlowBar
            budget={project.budget}
            paid={stats.totalPaid}
            allocated={stats.totalAllocated}
          />
        </div>

        <div className="p-8">
          {/* Add Task Form */}
          {(userRole === 'client' || userRole === 'admin') && (
            <form
              onSubmit={actions.addTask}
              className="mb-10 flex flex-col items-end gap-3 rounded-2xl border border-[#E8DDD0] bg-gray-50/50 p-3 lg:flex-row"
            >
              <div className="w-full flex-1">
                <input
                  className="w-full rounded-xl border-2 border-[#E8DDD0] bg-white p-4 font-medium outline-none focus:border-[#C9A84C]"
                  placeholder="وصف المهمة"
                  value={form.name}
                  onChange={(e) => form.setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative w-full lg:w-72">
                <input
                  className="w-full rounded-xl border-2 border-[#E8DDD0] bg-white p-4 font-medium outline-none focus:border-[#C9A84C]"
                  placeholder="البريد الإلكتروني للمستقل"
                  value={form.freelancerQuery}
                  onChange={(e) => form.lookupFreelancer(e.target.value)}
                  required
                />
                {form.resolvedFreelancer && (
                  <div className="absolute top-1/2 left-3 -translate-y-1/2 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700">
                    <UserIcon size={10} /> {form.resolvedFreelancer.name}
                  </div>
                )}
              </div>
              <div className="w-full lg:w-40">
                <input
                  className="w-full rounded-xl border-2 border-[#E8DDD0] bg-white p-4 text-left font-medium outline-none focus:border-[#C9A84C]"
                  dir="ltr"
                  type="number"
                  placeholder="المبلغ $"
                  value={form.payment}
                  onChange={(e) => form.setPayment(e.target.value)}
                  required
                />
              </div>
              <button className="flex items-center gap-2 rounded-xl bg-[#0D1B2A] px-6 py-4 font-bold text-white shadow-lg">
                <Send size={18} /> إرسال دعوة
              </button>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-4">
            <h2 className="mb-6 text-2xl font-bold text-[#0D1B2A]">المهام التعاقدية</h2>
            {project.tasks.map((t) => (
              <TaskRow
                key={t.id}
                t={t}
                project={project}
                onApprove={actions.completeTask}
                onDispute={(task) => modals.setDisputeTarget({ project, task })}
                onTaskClick={modals.setSelectedTask}
                userRole={userRole}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Modals */}
      {modals.disputeTarget && (
        <DisputeModal target={modals.disputeTarget} onClose={() => modals.setDisputeTarget(null)} />
      )}
      {modals.selectedTask && (
        <TaskDetailsModal
          task={modals.selectedTask}
          onClose={() => modals.setSelectedTask(null)}
          onApprove={actions.completeTask}
          userRole={userRole}
        />
      )}
    </div>
  );
};

export default ProjectDetailsView;
