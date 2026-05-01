import React, { FC, useState } from 'react';
import { X, Lock, TrendingUp, Users, Upload, FileText, AlertCircle, Send, CheckCircle, Globe } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format';
import { MyTask } from '../hooks/useFreelancerDashboard';
import { useLanguage } from '@/shared/context/LanguageContext';
import { translations } from '@/shared/translations';
import { cn } from '@/shared/utils/cn';

interface TaskSubmissionModalProps {
  task: MyTask;
  onClose: () => void;
  onSubmit: (projectId: string, taskId: string, fileName: string) => Promise<boolean>;
}

export const TaskSubmissionModal: FC<TaskSubmissionModalProps> = ({ task, onClose, onSubmit }) => {
  const { lang, isRtl } = useLanguage();
  const t = translations.dashboard[lang].freelancer.taskSubmission;
  
  const [uploadedFile, setUploadedFile] = useState('');
  const [requestSent, setRequestSent] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadedFile(e.target.files?.[0]?.name || '');
  };

  const handleSubmit = async () => {
    if (!uploadedFile) return;
    const success = await onSubmit(task.projectId, task.id, uploadedFile);
    if (success) setRequestSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/60 backdrop-blur-sm">
      <div className="bg-[#F9F4EE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#E8DDD0] bg-[#F9F4EE]">
          <div className={isRtl ? "text-right" : "text-left"}>
            <h2 className="text-xl font-black text-[#0D1B2A]">{task.name}</h2>
            <p className="text-sm text-gray-500">{task.projectName}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="rounded-2xl p-5 border-2 border-[#C9A84C]" style={{ background: 'rgba(201,168,76,0.06)' }}>
            <p className={cn("text-xs font-black text-[#C9A84C] uppercase tracking-widest mb-1 flex items-center gap-2", isRtl ? "text-right" : "text-left flex-row-reverse")}>
              <Lock size={12} /> {t.securedFunds}
            </p>
            <p className="text-4xl font-black mb-2 text-[#0D1B2A]" dir="ltr">{formatCurrency(task.payment)}</p>
            <p className={cn("text-sm text-gray-500", isRtl ? "text-right" : "text-left")}>✅ {t.securedMsg}</p>
          </div>

          {!task.paid && (
            <div className="bg-white rounded-2xl p-5 border border-[#E8DDD0]">
              <h3 className={cn("font-bold text-sm text-gray-500 uppercase mb-4 flex items-center gap-2", !isRtl && "flex-row-reverse")}>
                <Upload size={14} /> {t.deliverTask}
              </h3>
              {requestSent ? (
                <div className="text-center py-6">
                  <CheckCircle size={48} className="text-emerald-600 mx-auto mb-3" />
                  <p className="font-black text-lg text-emerald-700">{t.sentSuccess}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#E8DDD0] rounded-xl cursor-pointer bg-[#F9F4EE] hover:border-[#C9A84C] transition-colors">
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    <Upload size={24} className="text-gray-300 mb-1" />
                    <p className="text-sm text-gray-400">{uploadedFile || t.uploadPrompt}</p>
                  </label>
                  <button 
                    disabled={!uploadedFile}
                    onClick={handleSubmit}
                    className={cn("w-full py-4 rounded-xl font-black text-white bg-[#C9A84C] disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2 shadow-lg", !isRtl && "flex-row-reverse")}
                  >
                    <Send size={18} /> {t.sendBtn}
                  </button>
                </div>
              )}
            </div>
          )}

          {task.paid && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
              <CheckCircle size={32} className="text-emerald-600 mx-auto mb-2" />
              <p className="font-black text-emerald-700 text-lg">{t.paidMsg}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
