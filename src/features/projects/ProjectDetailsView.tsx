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
  
  const {
    project,
    form,
    modals,
    stats,
    actions
  } = useProjectDetails(id);

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-[#E8DDD0] border-t-[#C9A84C] rounded-full animate-spin mb-4" />
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
        className="max-w-5xl mx-auto bg-white rounded-[28px] overflow-hidden shadow-2xl relative z-50 mb-10" 
        dir="rtl"
      >
        {/* Header Section */}
        <div className="bg-white border-b border-[#E8DDD0] p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pl-12">
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h1 className="text-3xl font-extrabold text-[#0D1B2A] tracking-tight">{project.title}</h1>
                <span className="bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/30 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                  <Lock size={12} /> الأموال محفوظة في كفيل
                </span>
                {stats.openDisputesCount > 0 && (
                  <span className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1">
                    <Gavel size={12} /> {stats.openDisputesCount} نزاع مفتوح
                  </span>
                )}
              </div>
              <p className="text-gray-400 font-medium">المدير: <span className="text-gray-600">{project.owner}</span></p>
            </div>
            <div className="text-right bg-[#0D1B2A] p-5 rounded-2xl min-w-[200px]">
              <span className="block text-xs font-black text-blue-200/60 mb-1 uppercase tracking-widest">الميزانية الإجمالية</span>
              <span className="block text-4xl font-black text-white tracking-tight">{formatCurrency(project.budget)}</span>
            </div>
          </div>
          <MoneyFlowBar budget={project.budget} paid={stats.totalPaid} allocated={stats.totalAllocated} />
        </div>

        <div className="p-8">
          {/* Add Task Form */}
          {(userRole === 'client' || userRole === 'admin') && (
            <form onSubmit={actions.addTask} className="flex flex-col lg:flex-row gap-3 mb-10 bg-gray-50/50 border border-[#E8DDD0] p-3 rounded-2xl items-end">
              <div className="flex-1 w-full">
                <input 
                  className="bg-white border-2 border-[#E8DDD0] p-4 w-full rounded-xl focus:border-[#C9A84C] outline-none font-medium"
                  placeholder="وصف المهمة" 
                  value={form.name} 
                  onChange={e => form.setName(e.target.value)} 
                  required 
                />
              </div>
              <div className="w-full lg:w-72 relative">
                <input
                  className="bg-white border-2 border-[#E8DDD0] p-4 w-full rounded-xl focus:border-[#C9A84C] outline-none font-medium"
                  placeholder="البريد الإلكتروني للمستقل"
                  value={form.freelancerQuery}
                  onChange={e => form.lookupFreelancer(e.target.value)}
                  required
                />
                {form.resolvedFreelancer && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-lg">
                    <UserIcon size={10} /> {form.resolvedFreelancer.name}
                  </div>
                )}
              </div>
              <div className="w-full lg:w-40">
                <input 
                  className="bg-white border-2 border-[#E8DDD0] p-4 w-full rounded-xl focus:border-[#C9A84C] outline-none font-medium text-left"
                  dir="ltr" type="number" placeholder="المبلغ $" value={form.payment} onChange={e => form.setPayment(e.target.value)} required 
                />
              </div>
              <button className="bg-[#0D1B2A] text-white font-bold px-6 py-4 rounded-xl flex items-center gap-2 shadow-lg">
                <Send size={18} /> إرسال دعوة
              </button>
            </form>
          )}

          {/* Tasks List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6">المهام التعاقدية</h2>
            {project.tasks.map(t => (
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
