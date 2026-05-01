import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Scale, TriangleAlert, FileText, Upload, Gavel, Cpu, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Project, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

interface DisputeTarget {
  project: Project;
  task: Task;
}

interface DisputeModalProps {
  target: DisputeTarget;
  onClose: () => void;
  onAcceptAI?: () => void;
}

const DISPUTE_REASONS = [
  'جودة التسليم لا تتوافق مع المتطلبات المتفق عليها',
  'تأخر في التسليم دون إبلاغ مسبق',
  'الدفعة لم تُصرف رغم الاعتماد',
  'العمل لم يُسلَّم أصلاً',
  'سبب آخر',
];

import { aiAnalyst } from '@/services/aiAnalyst';

export const DisputeModal: React.FC<DisputeModalProps> = ({ target, onClose, onAcceptAI }) => {
  const [reason, setReason] = useState('');
  const [caseText, setCaseText] = useState('');
  const [evidenceFile, setEvidenceFile] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<null | any>(null);
  const queryClient = useQueryClient();

  const openDisputeMutation = useMutation({
    mutationFn: () => api.openDispute(target.project.id, target.task.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  const acceptAiMutation = useMutation({
    mutationFn: () => api.completeTask(target.project.id, target.task.id), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['ledger'] });
    },
  });

  const canSubmit = reason && caseText.length >= 20;

  // Accessibility: Trap focus or handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (aiAnalyzing) {
      aiAnalyst.analyzeDispute(target.project, target.task).then(result => {
        setAiResult(result);
        setAiAnalyzing(false);
      }).catch(() => {
        setAiAnalyzing(false);
        setAiResult({
          suggestion: 'Fair Split Recommended',
          details: 'Analysis fallback engaged.',
          confidence: 0
        });
      });
    }
  }, [aiAnalyzing, target.project, target.task]);

  if (submitted) {
    if (aiAnalyzing) {
      return (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,27,42,0.75)] backdrop-blur-sm"
          role="dialog" aria-modal="true" aria-labelledby="dispute-analyzing-title"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            className="bg-[var(--color-kafil-cream)] w-full max-w-md rounded-3xl shadow-[var(--shadow-modal)] p-8 text-center" dir="rtl"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <Cpu size={30} className="text-blue-600" />
            </div>
            <h3 id="dispute-analyzing-title" className="text-xl font-black text-[var(--color-kafil-midnight)] mb-2">جاري تحليل النزاع بواسطة الذكاء الاصطناعي...</h3>
            <p className="text-gray-500 text-sm mb-6">يقوم "مُقيّم العدالة" بتحليل المحادثات ونسبة الإنجاز وسجل المشروع.</p>
            <div className="flex justify-center space-x-2 space-x-reverse">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </motion.div>
        </motion.div>
      );
    }

    if (aiResult) {
      return (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,27,42,0.75)] backdrop-blur-sm"
          role="dialog" aria-modal="true" aria-labelledby="dispute-result-title"
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            className="bg-[var(--color-kafil-cream)] w-full max-w-md rounded-3xl shadow-[var(--shadow-modal)] p-8 text-center" dir="rtl"
          >
            <div className="w-16 h-16 rounded-full bg-[var(--color-kafil-midnight)] flex items-center justify-center mx-auto mb-5 relative">
              <Scale size={30} className="text-[var(--color-kafil-gold)]" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[var(--color-kafil-cream)]">
                 <CheckCircle size={14} className="text-white" />
              </div>
            </div>
            <h3 id="dispute-result-title" className="text-2xl font-black text-[var(--color-kafil-midnight)] mb-2">قرار مقترح للنزاع</h3>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-right mb-5">
               <p className="text-sm font-black text-emerald-800 mb-1">AI Suggestion:</p>
               <p className="text-xl font-black text-emerald-700 dir-ltr text-center mb-2">{aiResult.suggestion}</p>
               <p className="text-xs text-emerald-600 leading-relaxed font-medium">{aiResult.details}</p>
            </div>
            
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 text-right">
              <p className="text-xs font-black text-amber-700">رسوم النزاع $10 مجمّدة</p>
              <p className="text-[10px] text-amber-600 font-medium leading-relaxed mt-0.5">في حال القبول المتبادل للاقتراح، لن يتم خصم الرسوم.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 mt-4">
              <button onClick={onClose} className="py-3 rounded-xl border-2 border-[var(--color-kafil-sand)] font-bold text-gray-500 hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-gray-300 outline-none">
                رفض (طلب محكم)
              </button>
              <button onClick={() => {
                acceptAiMutation.mutate();
                toast.success('تمت الموافقة على اقتراح الذكاء الاصطناعي وتم حل النزاع وتحرير الدفعة');
                if (onAcceptAI) onAcceptAI();
                onClose();
              }} className="py-3 rounded-xl font-black text-[var(--color-kafil-midnight)] bg-[var(--color-kafil-gold)] hover:bg-[#D4B55E] transition-colors focus:ring-4 focus:ring-[var(--color-kafil-gold)]/50 outline-none">
                قبول الاقتراح
              </button>
            </div>
          </motion.div>
        </motion.div>
      );
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(13,27,42,0.75)] backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-labelledby="dispute-modal-title"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }} 
        className="bg-[var(--color-kafil-cream)] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[var(--shadow-modal)]" dir="rtl"
      >
        {/* Header */}
        <div className="bg-red-600 p-6 rounded-t-3xl flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black text-red-200 uppercase tracking-widest mb-1">فتح نزاع تحكيمي</p>
            <h2 id="dispute-modal-title" className="text-xl font-black text-white">{target.task.name}</h2>
            <p className="text-red-200/70 text-sm">{target.project.title} · {target.task.assignedTo}</p>
          </div>
          <button aria-label="إغلاق النافذة" onClick={onClose} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/70 hover:bg-white/20 transition-colors mt-0.5 focus:outline-none focus:ring-2 focus:ring-white">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Warning Banner */}
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <TriangleAlert size={16} className="text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="text-xs font-black text-amber-700 mb-0.5">فتح نزاع يجمّد المدفوعات المعلقة فوراً.</p>
              <p className="text-xs text-amber-600">رسوم تقديم: <strong>$10</strong> · تُستردّ إذا صدر الحكم لصالحك.</p>
            </div>
          </div>

          {/* Disputed Task Info */}
          <div className="bg-white border border-[var(--color-kafil-sand)] rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المهمة المتنازع عليها</p>
              <p className="font-black text-[var(--color-kafil-midnight)]">{target.task.name}</p>
              <p className="text-xs text-gray-400">مسند إلى: {target.task.assignedTo}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المبلغ</p>
              <p className="text-2xl font-black text-[var(--color-kafil-midnight)]">{formatCurrency(target.task.payment)}</p>
            </div>
          </div>

          {/* Reason */}
          <fieldset>
            <legend className="text-sm font-black text-[var(--color-kafil-midnight)] mb-3">ما سبب النزاع؟</legend>
            <div className="space-y-2">
              {DISPUTE_REASONS.map(r => (
                <button
                  key={r}
                  type="button"
                  aria-pressed={reason === r}
                  onClick={() => setReason(r)}
                  className={`w-full text-right p-3 rounded-xl border-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-400 ${
                    reason === r ? 'border-red-400 bg-red-50 text-red-800 font-bold' : 'border-[var(--color-kafil-sand)] bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className={`inline-block w-4 h-4 rounded-full border-2 mr-2 align-middle ${reason === r ? 'border-red-500 bg-red-500' : 'border-gray-300'}`} aria-hidden="true" />
                  {r}
                </button>
              ))}
            </div>
          </fieldset>

          {/* Case Text */}
          <div>
            <label htmlFor="case-text" className="block text-sm font-black text-[var(--color-kafil-midnight)] mb-2">اشرح قضيتك <span className="text-gray-400 font-normal">(بحد أدنى 20 حرف)</span></label>
            <textarea
              id="case-text"
              value={caseText}
              onChange={e => setCaseText(e.target.value)}
              placeholder="اشرح بالتفصيل ما حدث، ومتى، وما الأدلة التي لديك..."
              className="w-full bg-white border-2 border-[var(--color-kafil-sand)] rounded-2xl p-4 text-sm focus:outline-none focus:border-red-300 transition-colors min-h-[100px] resize-none"
              aria-describedby="case-text-hint"
            />
            <p id="case-text-hint" className="text-[10px] text-gray-400 mt-1 text-left" aria-live="polite">{caseText.length} / 500</p>
          </div>

          {/* Evidence Upload */}
          <div>
            <p className="text-sm font-black text-[var(--color-kafil-midnight)] mb-2" id="evidence-label">أدلة داعمة <span className="text-gray-400 font-normal">(اختياري)</span></p>
            <label className={`flex items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-[var(--color-kafil-gold)] ${
              evidenceFile ? 'border-emerald-400 bg-emerald-50' : 'border-[var(--color-kafil-sand)] hover:border-red-300'
            }`}>
              <input type="file" className="hidden" aria-labelledby="evidence-label" onChange={e => setEvidenceFile(e.target.files?.[0]?.name || '')} />
              {evidenceFile
                ? <><FileText size={18} className="text-emerald-600" aria-hidden="true" /><span className="text-sm font-bold text-emerald-700">{evidenceFile}</span></>
                : <><Upload size={18} className="text-gray-300" aria-hidden="true" /><span className="text-sm text-gray-400">رفع صورة، ملف، أو تصدير محادثة</span></>}
            </label>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button onClick={onClose} className="py-3.5 rounded-xl border border-[var(--color-kafil-sand)] text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300">
              إلغاء
            </button>
            <button
              disabled={!canSubmit || openDisputeMutation.isPending}
              onClick={() => { 
                if (canSubmit) { 
                  openDisputeMutation.mutate(undefined, {
                    onSuccess: () => {
                      setSubmitted(true); 
                      setAiAnalyzing(true); 
                      toast.error('⚠️ تم فتح النزاع — المدفوعات مجمّدة');
                    }
                  });
                } 
              }}
              className="py-3.5 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-400/50"
            >
              <Gavel size={16} aria-hidden="true" /> تقديم النزاع · $10
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
