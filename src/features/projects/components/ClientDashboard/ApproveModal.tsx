import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, FileText, AlertTriangle, ThumbsUp } from 'lucide-react';
import { Project, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

interface ApproveModalProps {
  project: Project;
  task: Task;
  submission: { by: string; milestone: string; files: string[]; date: string } | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const ApproveModal: React.FC<ApproveModalProps> = ({ project, task, submission, onClose, onConfirm }) => {
  // Accessibility: Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,27,42,0.7)] backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-labelledby="approve-modal-title"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} 
        className="bg-[var(--color-kafil-cream)] w-full max-w-lg rounded-3xl shadow-[var(--shadow-modal)] overflow-hidden" dir="rtl"
      >
        <div className="bg-[var(--color-kafil-midnight)] p-6 flex justify-between items-start">
          <div>
            <p className="text-[10px] font-black text-[var(--color-kafil-gold)] uppercase tracking-widest mb-1">طلب اعتماد وصرف</p>
            <h2 id="approve-modal-title" className="text-xl font-black text-white">{task.name}</h2>
            <p className="text-blue-200/60 text-sm">{project.title}</p>
          </div>
          <button aria-label="إغلاق النافذة" onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-kafil-gold)]">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Amount to release */}
          <div className="bg-white border-2 border-[var(--color-kafil-gold)] rounded-2xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-[var(--color-kafil-gold)] uppercase mb-1">سيتم إفراجه من الضمان</p>
              <p className="text-4xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(task.payment)}</p>
            </div>
            <div className="bg-[var(--color-kafil-gold)]/10 p-4 rounded-xl">
              <Lock size={28} className="text-[var(--color-kafil-gold)]" aria-hidden="true" />
            </div>
          </div>

          {/* Submitted Files */}
          {submission && (
            <div className="bg-white border border-[var(--color-kafil-sand)] rounded-2xl p-5 space-y-3">
              <p className="text-xs font-black text-gray-400 uppercase">الملفات المقدمة من {submission.by}</p>
              <p className="text-xs text-gray-400">تاريخ التقديم: {submission.date}</p>
              <div className="flex flex-wrap gap-2" role="list" aria-label="الملفات المرفقة">
                {submission.files.map(f => (
                  <div key={f} role="listitem" className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                    <FileText size={14} className="text-[var(--color-kafil-gold)]" aria-hidden="true" /> {f}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-amber-700 font-medium">الاعتماد نهائي ولا يمكن التراجع عنه. الأموال ستُحوّل مباشرة للمستقل.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={onClose} className="py-3 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              className="py-3 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 bg-[var(--color-kafil-teal)] focus:outline-none focus:ring-4 focus:ring-[var(--color-kafil-teal)]/50"
              style={{ boxShadow: '0 4px 16px rgba(26,127,116,0.4)' }}
            >
              <ThumbsUp size={16} aria-hidden="true" /> اعتماد وصرف الآن
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
