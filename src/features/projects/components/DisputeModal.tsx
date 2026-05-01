import { FC, useState } from 'react';
import { X, Scale, TriangleAlert, FileText, Upload, Gavel } from 'lucide-react';
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

interface DisputeModalProps {
  target: { project: Project; task: Task };
  onClose: () => void;
}

export const DisputeModal: FC<DisputeModalProps> = ({ target, onClose }) => {
  const [reason, setReason] = useState('');
  const [caseText, setCaseText] = useState('');
  const [evidenceFile, setEvidenceFile] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = reason && caseText.length >= 20;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/80 backdrop-blur-sm">
        <div className="bg-[#F9F4EE] w-full max-w-md rounded-3xl shadow-2xl p-8 text-center" dir="rtl">
          <div className="w-16 h-16 rounded-full bg-[#0D1B2A] flex items-center justify-center mx-auto mb-5">
            <Scale size={30} className="text-[#C9A84C]" />
          </div>
          <h3 className="text-2xl font-black text-[#0D1B2A] mb-2">تم فتح النزاع</h3>
          <p className="text-gray-500 text-sm mb-6">سيتم اختيار محكمين مستقلين للتحقق من القضية.</p>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-black text-white bg-[#0D1B2A]">
            حسناً، فهمت
          </button>
        </div>
      </div>
    );
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
              disabled={!canSubmit}
              onClick={() => { setSubmitted(true); toast.error('⚠️ تم فتح النزاع'); }}
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
