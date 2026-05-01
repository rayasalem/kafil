import { FC } from 'react';
import { X, FileText, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/shared/utils/format';
import { MyInvitation } from '../hooks/useFreelancerDashboard';

interface InvitationDetailModalProps {
  inv: MyInvitation;
  onClose: () => void;
  onAccept: (inv: MyInvitation) => void;
  onReject: (inv: MyInvitation) => void;
}

export const InvitationDetailModal: FC<InvitationDetailModalProps> = ({ inv, onClose, onAccept, onReject }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D1B2A]/60 backdrop-blur-sm">
      <div className="bg-[#F9F4EE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" dir="rtl">
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#E8DDD0] bg-[#F9F4EE]">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">تفاصيل دعوة العمل</p>
            <h2 className="text-xl font-black text-[#0D1B2A]">{inv.projectName}</h2>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المهمة</p>
              <p className="text-sm font-bold text-[#0D1B2A]">{inv.taskName}</p>
            </div>
            <div className="bg-white border border-[#C9A84C] p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-[#C9A84C] uppercase mb-1">الميزانية</p>
              <p className="text-lg font-black text-[#0D1B2A]">{formatCurrency(inv.budget)}</p>
            </div>
            <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">الموعد</p>
              <p className="text-sm font-bold text-[#0D1B2A]">{inv.deadline}</p>
            </div>
            <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المرسل</p>
              <p className="text-sm font-bold text-[#0D1B2A]">{inv.sender}</p>
            </div>
          </div>

          <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
            <h3 className="font-bold text-[#0D1B2A] mb-2 flex items-center gap-2"><FileText size={16} className="text-[#C9A84C]" /> نبذة عن المشروع</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{inv.description}</p>
          </div>

          <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
            <h3 className="font-bold text-[#0D1B2A] mb-3 flex items-center gap-2"><CheckCircle size={16} className="text-[#1A7F74]" /> المتطلبات</h3>
            <ul className="space-y-2">
              {inv.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-1.5 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-[#E8DDD0] p-6 flex items-center gap-4">
          <button onClick={() => onAccept(inv)} className="flex-1 bg-[#1A7F74] text-white font-black py-4 rounded-xl shadow-lg">قبول الانضمام</button>
          <button onClick={() => onReject(inv)} className="px-8 py-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl">رفض</button>
        </div>
      </div>
    </div>
  );
};
