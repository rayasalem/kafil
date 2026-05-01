import { FC, useState, useEffect } from 'react';
import { X, Scale, TriangleAlert, FileText, Upload, Gavel, Cpu, CheckCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Project, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';
import { toast } from 'sonner';

const DISPUTE_REASONS = [
  'جودة التسليم لا تتوافق مع المتطلبات المتفق عليها',
  'تأخر في التسليم دون إبلاغ مسبق',
  'الدفعة لم تُصرف رغم الاعتماد',
  'العمل لم يُسلَّم أصلاً',
  'سبب آخر',
];

import { aiAnalyst } from '@/services/aiAnalyst';

interface DisputeModalProps {
  target: { project: Project; task: Task };
  onClose: () => void;
  onAcceptAI?: () => void;
}

export const DisputeModal: FC<DisputeModalProps> = ({ target, onClose, onAcceptAI }) => {
  const [reason, setReason] = useState('');
  const [caseText, setCaseText] = useState('');
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

  useEffect(() => {
    if (aiAnalyzing) {
      aiAnalyst.analyzeDispute(target.project, target.task).then(result => {
        setAiResult(result);
        setAiAnalyzing(false);
      }).catch(() => {
        setAiAnalyzing(false);
        setAiResult({
          suggestion: '50/50 Split suggested',
          details: 'Technical error in analysis. Defaulting to safe split recommendation.',
          confidence: 0
        });
      });
    }
  }, [aiAnalyzing, target.project, target.task]);

  if (submitted) {
    if (aiAnalyzing) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/80 backdrop-blur-sm">
          <div className="bg-[#F9F4EE] w-full max-w-md rounded-3xl shadow-2xl p-8 text-center" dir="rtl">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-5 animate-pulse">
              <Cpu size={30} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-black text-[#0D1B2A] mb-2">جاري تحليل النزاع بواسطة الذكاء الاصطناعي...</h3>
            <p className="text-gray-500 text-sm mb-6">يقوم "مُقيّم العدالة" بتحليل المحادثات ونسبة الإنجاز وسجل المشروع.</p>
            <div className="flex justify-center space-x-2 space-x-reverse">
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
               <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      );
    }

    if (aiResult) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/80 backdrop-blur-sm">
          <div className="bg-[#F9F4EE] w-full max-w-md rounded-3xl shadow-2xl p-8 text-center" dir="rtl">
            <div className="w-16 h-16 rounded-full bg-[#0D1B2A] flex items-center justify-center mx-auto mb-5 relative">
              <Scale size={30} className="text-[#C9A84C]" />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 border-2 border-[#F9F4EE]">
                 <CheckCircle size={14} className="text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#0D1B2A] mb-2">قرار مقترح للنزاع</h3>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-right mb-4">
               <p className="text-sm font-black text-emerald-800 mb-1">AI Suggestion:</p>
               <p className="text-lg font-black text-emerald-700 dir-ltr text-center mb-2">{aiResult.suggestion}</p>
               <p className="text-xs text-emerald-600 leading-relaxed font-medium">{aiResult.details}</p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-6">
              <button onClick={onClose} className="py-3 rounded-xl border border-[#E8DDD0] font-bold text-gray-500 hover:bg-gray-100">رفض (طلب محكم بشري)</button>
              <button onClick={() => {
                acceptAiMutation.mutate();
                toast.success('تمت الموافقة على اقتراح الذكاء الاصطناعي وتم حل النزاع وتحرير الدفعة');
                if (onAcceptAI) onAcceptAI();
                onClose();
              }} className="py-3 rounded-xl font-black text-white bg-[#0D1B2A]">
                قبول الاقتراح
              </button>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/80 backdrop-blur-sm">
      <div className="bg-[#F9F4EE] w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" dir="rtl">
        <div className="bg-red-600 p-6 rounded-t-3xl flex items-start justify-between text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-1 opacity-70">فتح نزاع تحكيمي</p>
            <h2 className="text-xl font-black">{target.task.name}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><X size={18}/></button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <TriangleAlert size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 font-bold">فتح نزاع يجمّد المدفوعات المعلقة فوراً. رسوم تقديم: $10.</p>
          </div>

          <div>
            <p className="text-sm font-black text-[#0D1B2A] mb-3">ما سبب النزاع؟</p>
            <div className="space-y-2">
              {DISPUTE_REASONS.map(r => (
                <button key={r} onClick={() => setReason(r)}
                  className={cn(
                    'w-full text-right p-3 rounded-xl border-2 text-sm transition-all',
                    reason === r ? 'border-red-400 bg-red-50 text-red-800 font-bold' : 'border-[#E8DDD0] bg-white text-gray-600'
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <textarea 
            value={caseText} 
            onChange={e => setCaseText(e.target.value)}
            placeholder="اشرح قضيتك بالتفصيل..."
            className="w-full bg-white border-2 border-[#E8DDD0] rounded-2xl p-4 text-sm min-h-[100px] outline-none focus:border-red-300"
          />

          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-3 rounded-xl border border-[#E8DDD0] font-bold">إلغاء</button>
            <button
              disabled={!canSubmit || openDisputeMutation.isPending}
              onClick={() => { 
                if (canSubmit) {
                  openDisputeMutation.mutate(undefined, {
                    onSuccess: () => {
                      setSubmitted(true); 
                      setAiAnalyzing(true); 
                      toast.error('⚠️ تم فتح النزاع'); 
                    }
                  });
                }
              }}
              className="py-3 rounded-xl font-black text-white bg-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Gavel size={16}/> تقديم النزاع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
