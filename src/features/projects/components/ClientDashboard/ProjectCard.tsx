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
  const pendingTask = p.tasks.find((t) => !t.paid && t.status === 'In Progress');
  const totalPaid = p.tasks.reduce((s, t) => (t.paid ? s + t.payment : s), 0);
  const totalAllocated = p.tasks.reduce((s, t) => s + t.payment, 0);
  const paidPct = p.budget ? (totalPaid / p.budget) * 100 : 0;
  const lockedPct = p.budget ? ((totalAllocated - totalPaid) / p.budget) * 100 : 0;

  return (
    <motion.article
      layout
      layoutId={`project-card-${p.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={
        isOpening
          ? {
              position: 'fixed',
              top: '20%',
              left: '50%',
              x: '-50%',
              width: '90vw',
              maxWidth: '800px',
              zIndex: 60,
              scale: 1.05,
              opacity: 1,
              boxShadow: '0 40px 100px -20px rgba(13,27,42,0.4)',
            }
          : {
              position: 'relative',
              top: 'auto',
              left: 'auto',
              x: '0%',
              width: 'auto',
              maxWidth: 'none',
              zIndex: 1,
              scale: 1,
              opacity: 1,
              boxShadow: '0 0px 0px 0px rgba(0,0,0,0)',
            }
      }
      whileHover={isOpening ? undefined : { y: -5, scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 80,
        damping: 15,
        mass: 1,
      }}
      className={`group relative transform-gpu overflow-hidden rounded-[28px] border border-[var(--color-kafil-sand)] bg-white transition-all duration-500 ease-out hover:border-[var(--color-kafil-gold)]/50 hover:shadow-2xl ${
        isDimming ? 'pointer-events-none scale-[0.9] opacity-0 blur-md transition-all duration-700' : ''
      }`}
      aria-labelledby={`project-title-${p.id}`}
      onClick={isOpening ? undefined : onViewDetails}
    >
      {/* Card Header */}
      <header className="relative z-10 border-b border-[var(--color-kafil-sand)] p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3
              id={`project-title-${p.id}`}
              className="text-xl font-black text-[var(--color-kafil-midnight)] transition-colors group-hover:text-[var(--color-kafil-gold)]"
            >
              {p.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-gray-400">المدير: {p.owner}</p>
          </div>
          <span
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--color-kafil-midnight)] px-3 py-1.5 text-[10px] font-black text-[var(--color-kafil-gold)]"
            aria-label="الأموال محجوزة في الضمان"
          >
            <Lock size={10} aria-hidden="true" /> الأموال محجوزة
          </span>
        </div>

        {/* Milestone Stepper */}
        {milestones.length > 0 && <MilestoneStepper milestones={milestones} />}
      </header>

      {/* Money Flow */}
      <div className="relative z-10 border-b border-[var(--color-kafil-sand)] bg-gray-50/50 px-6 py-4">
        <div className="mb-2 flex justify-between text-[10px] font-black text-gray-400 uppercase">
          <span>التدفق المالي</span>
          <span>
            الميزانية:{' '}
            <span className="text-[var(--color-kafil-midnight)]">{formatCurrency(p.budget)}</span>
          </span>
        </div>
        <div
          className="flex h-2.5 w-full overflow-hidden rounded-full bg-gray-100 shadow-inner"
          role="progressbar"
          aria-valuenow={paidPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="تقدم صرف الميزانية"
        >
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${paidPct}%` }}
            title={`مُصرف: ${formatCurrency(totalPaid)}`}
          />
          <div
            className="h-full bg-[var(--color-kafil-gold)] opacity-80 transition-all duration-700"
            style={{ width: `${lockedPct}%` }}
            title={`محجوز: ${formatCurrency(totalAllocated - totalPaid)}`}
          />
        </div>
        <div className="mt-2 flex gap-4 text-[10px] font-bold" aria-hidden="true">
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
            مُصرف {formatCurrency(totalPaid)}
          </span>
          <span className="flex items-center gap-1 text-[var(--color-kafil-gold)]">
            <span className="inline-block h-2 w-2 rounded-sm bg-[var(--color-kafil-gold)]" />
            محجوز {formatCurrency(totalAllocated - totalPaid)}
          </span>
        </div>
      </div>

      {/* Team Allocation */}
      <div className="relative z-10 space-y-3 border-b border-[var(--color-kafil-sand)] px-6 py-4">
        <p className="mb-2 text-[10px] font-black text-gray-400 uppercase">توزيع الفريق</p>
        {p.tasks.map((t) => (
          <div
            key={t.id}
            className="group/task relative -m-1 rounded-xl p-1 focus-within:ring-2 focus-within:ring-[var(--color-kafil-gold)]"
          >
            <div className="mb-1 flex items-center gap-3">
              <div
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-[9px] font-black text-gray-500"
                aria-hidden="true"
              >
                {t.assignedTo.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex justify-between text-xs font-bold text-[var(--color-kafil-midnight)]">
                  <span className="truncate">
                    {t.assignedTo} · {t.name}
                  </span>
                  <span className="mr-2 shrink-0 text-gray-500">{formatCurrency(t.payment)}</span>
                </div>
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100"
                  role="progressbar"
                  aria-valuenow={t.paid ? 100 : t.status === 'In Progress' ? 60 : 10}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${t.paid ? 'bg-emerald-500' : 'bg-[var(--color-kafil-gold)] opacity-60'}`}
                    style={{ width: t.paid ? '100%' : t.status === 'In Progress' ? '60%' : '10%' }}
                  />
                </div>
              </div>
            </div>
            {!t.paid && (
              <div className="flex justify-end opacity-0 transition-opacity duration-200 group-hover/task:opacity-100 focus-within:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDispute(p, t);
                  }}
                  className="flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-[10px] font-black text-red-600 transition-all hover:border-red-200 hover:bg-red-100 focus:ring-2 focus:ring-red-500 focus:outline-none"
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
      <footer className="relative z-10 flex flex-wrap items-center gap-3 p-5">
        {submission && pendingTask && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApprove(p.id, pendingTask.id);
            }}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-kafil-teal)] py-3 text-sm font-black text-white transition-all hover:-translate-y-0.5 hover:shadow-lg focus:ring-4 focus:ring-[var(--color-kafil-teal)]/50 focus:outline-none"
            style={{ boxShadow: '0 2px 12px rgba(26,127,116,0.3)' }}
          >
            <ThumbsUp size={16} aria-hidden="true" /> اعتماد وصرف الآن
          </button>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="flex items-center gap-2 rounded-xl border border-[var(--color-kafil-sand)] px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        >
          <Eye size={16} aria-hidden="true" /> عرض التفاصيل
        </button>
      </footer>

      {/* Animated Expansion Overlay when clicked */}
      {isOpening && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 50 }}
          transition={{ duration: 0.6, ease: 'easeIn' }}
          className="absolute top-1/2 left-1/2 z-0 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-kafil-gold)]/10"
        />
      )}
    </motion.article>
  );
};
