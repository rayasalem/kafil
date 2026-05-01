import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, Gavel, ThumbsUp } from 'lucide-react';
import { Project, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { MilestoneStepper } from './MilestoneStepper';

interface ProjectCardProps {
  p: Project;
  milestones: { name: string; status: 'done' | 'review' | 'upcoming' }[];
  submission: { by: string; milestone: string; files: string[]; date: string } | null;
  onApprove: (projectId: string, taskId: string) => void;
  onDispute: (project: Project, task: Task) => void;
  onViewDetails: () => void;
  isOpening?: boolean;
  isDimming?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  p,
  milestones,
  submission,
  onApprove,
  onDispute,
  onViewDetails,
  isOpening = false,
  isDimming = false,
}) => {
  const pendingTask = p.tasks.find(t => !t.paid && t.status === 'In Progress');
  const totalPaid = p.tasks.reduce((s, t) => t.paid ? s + t.payment : s, 0);
  const totalAllocated = p.tasks.reduce((s, t) => s + t.payment, 0);
  const paidPct = p.budget ? (totalPaid / p.budget) * 100 : 0;
  const lockedPct = p.budget ? ((totalAllocated - totalPaid) / p.budget) * 100 : 0;

  return (
    <motion.article 
      layout
      layoutId={`project-card-${p.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isOpening ? {
        scale: 1.045,
        y: 0,
        opacity: 1,
        boxShadow: '0 40px 100px -20px rgba(13,27,42,0.35)'
      } : {
        opacity: 1,
        y: 0,
        scale: 1,
        boxShadow: '0 0 0 0 rgba(0,0,0,0)'
      }}
      whileHover={isOpening ? undefined : { y: -5, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 130, damping: 18, mass: 1 }}
      className={`bg-white border border-[var(--color-kafil-sand)] rounded-[28px] overflow-hidden hover:shadow-2xl hover:border-[var(--color-kafil-gold)]/50 transition-all duration-300 group relative z-10 ${
        isOpening
          ? 'fixed top-1/2 left-1/2 z-60 w-[min(92vw,860px)] -translate-x-1/2 -translate-y-1/2'
          : ''
      } ${isDimming ? 'pointer-events-none opacity-20 blur-[1px] scale-[0.98]' : ''}`}
      aria-labelledby={`project-title-${p.id}`}
    >
      {/* Card Header */}
      <header className="p-6 border-b border-[var(--color-kafil-sand)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 id={`project-title-${p.id}`} className="font-black text-xl text-[var(--color-kafil-midnight)] group-hover:text-[var(--color-kafil-gold)] transition-colors">{p.title}</h3>
            <p className="text-xs text-gray-400 font-medium mt-1">المدير: {p.owner}</p>
          </div>
          <span className="flex items-center gap-1.5 bg-[var(--color-kafil-midnight)] text-[var(--color-kafil-gold)] px-3 py-1.5 rounded-full text-[10px] font-black shrink-0" aria-label="الأموال محجوزة في الضمان">
            <Lock size={10} aria-hidden="true" /> الأموال محجوزة
          </span>
        </div>

        {/* Milestone Stepper */}
        {milestones.length > 0 && <MilestoneStepper milestones={milestones} />}
      </header>

      {/* Money Flow */}
      <div className="px-6 py-4 bg-gray-50/50 border-b border-[var(--color-kafil-sand)]">
        <div className="flex justify-between text-[10px] font-black text-gray-400 uppercase mb-2">
          <span>التدفق المالي</span>
          <span>الميزانية: <span className="text-[var(--color-kafil-midnight)]">{formatCurrency(p.budget)}</span></span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner" role="progressbar" aria-valuenow={paidPct} aria-valuemin={0} aria-valuemax={100} aria-label="تقدم صرف الميزانية">
          <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${paidPct}%` }} title={`مُصرف: ${formatCurrency(totalPaid)}`} />
          <div className="h-full bg-[var(--color-kafil-gold)] opacity-80 transition-all duration-700" style={{ width: `${lockedPct}%` }} title={`محجوز: ${formatCurrency(totalAllocated - totalPaid)}`} />
        </div>
        <div className="flex gap-4 mt-2 text-[10px] font-bold" aria-hidden="true">
          <span className="flex items-center gap-1 text-emerald-600"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" />مُصرف {formatCurrency(totalPaid)}</span>
          <span className="flex items-center gap-1 text-[var(--color-kafil-gold)]"><span className="w-2 h-2 rounded-sm bg-[var(--color-kafil-gold)] inline-block" />محجوز {formatCurrency(totalAllocated - totalPaid)}</span>
          <span className="flex items-center gap-1 text-gray-400"><span className="w-2 h-2 rounded-sm bg-gray-200 inline-block" />متاح {formatCurrency(p.budget - totalAllocated)}</span>
        </div>
      </div>

      {/* Team Allocation */}
      <div className="px-6 py-4 border-b border-[var(--color-kafil-sand)] space-y-3">
        <p className="text-[10px] font-black text-gray-400 uppercase mb-2">توزيع الفريق</p>
        {p.tasks.map(t => (
          <div key={t.id} className="group/task relative focus-within:ring-2 focus-within:ring-[var(--color-kafil-gold)] rounded-xl p-1 -m-1">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-black text-gray-500 shrink-0" aria-hidden="true">
                {t.assignedTo.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs font-bold text-[var(--color-kafil-midnight)] mb-1">
                  <span className="truncate">{t.assignedTo} · {t.name}</span>
                  <span className="text-gray-500 shrink-0 mr-2">{formatCurrency(t.payment)}</span>
                </div>
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={t.paid ? 100 : t.status === 'In Progress' ? 60 : 10} aria-valuemin={0} aria-valuemax={100}>
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${t.paid ? 'bg-emerald-500' : 'bg-[var(--color-kafil-gold)] opacity-60'}`}
                    style={{ width: t.paid ? '100%' : t.status === 'In Progress' ? '60%' : '10%' }}
                  />
                </div>
              </div>
              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0 ${
                t.paid ? 'bg-emerald-50 text-emerald-700' :
                t.status === 'In Progress' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-400'
              }`}>
                {t.paid ? '✔ مدفوع' : t.status === 'In Progress' ? '⏳ جاري' : '⏱ انتظار'}
              </span>
            </div>
            {!t.paid && (
              <div className="flex justify-end opacity-0 group-hover/task:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => onDispute(p, t)}
                  className="flex items-center gap-1.5 text-[10px] font-black text-red-600 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full hover:bg-red-100 hover:border-red-200 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                  aria-label={`فتح نزاع ضد ${t.assignedTo} لمهمة ${t.name}`}
                >
                  <Gavel size={11} aria-hidden="true" /> فتح نزاع ضد {t.assignedTo}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions Footer */}
      <footer className="p-5 flex flex-wrap gap-3 items-center">
        {submission && pendingTask && (
          <button
            onClick={() => onApprove(p.id, pendingTask.id)}
            className="flex-1 py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-lg bg-[var(--color-kafil-teal)] focus:outline-none focus:ring-4 focus:ring-[var(--color-kafil-teal)]/50"
            style={{ boxShadow: '0 2px 12px rgba(26,127,116,0.3)' }}
          >
            <ThumbsUp size={16} aria-hidden="true" /> اعتماد تسليم {submission.milestone}
          </button>
        )}
        <button
          type="button"
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[var(--color-kafil-sand)] text-sm font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          <Eye size={16} aria-hidden="true" /> عرض التفاصيل
        </button>
      </footer>
    </motion.article>
  );
};
