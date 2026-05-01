import { FC } from 'react';
import { formatCurrency } from '@/shared/utils/format';
import { MyInvitation } from '../hooks/useFreelancerDashboard';

interface InvitationCardProps {
  inv: MyInvitation;
  onAccept: (inv: MyInvitation) => void;
  onReject: (inv: MyInvitation) => void;
  onViewDetails: (inv: MyInvitation) => void;
}

export const InvitationCard: FC<InvitationCardProps> = ({ inv, onAccept, onReject, onViewDetails }) => {
  return (
    <div className="bg-white border-2 border-blue-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
      <div className="flex flex-col md:flex-row justify-between gap-4 text-right">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">دعوة عمل</span>
            <span className="text-xs text-gray-500 font-medium">من: {inv.sender} ({inv.senderRole})</span>
          </div>
          <h3 className="font-black text-xl text-[#0D1B2A] mb-1">{inv.projectName}</h3>
          <p className="text-sm font-bold text-gray-600 mb-4">المهمة: <span className="text-[#0D1B2A]">{inv.taskName}</span></p>
          
          <div className="flex gap-6">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">الميزانية المقترحة</p>
              <p className="text-lg font-black text-[#C9A84C]">{formatCurrency(inv.budget)}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase">الموعد النهائي</p>
              <p className="text-lg font-bold text-[#0D1B2A]">{inv.deadline}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-row md:flex-col items-center justify-center gap-3 min-w-[150px]">
          <button 
            onClick={() => onAccept(inv)}
            className="w-full bg-[#1A7F74] text-white font-black py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg text-sm"
          >
            قبول الانضمام
          </button>
          <div className="flex gap-2 w-full">
            <button 
              onClick={() => onViewDetails(inv)}
              className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-100 text-xs"
            >
              عرض التفاصيل
            </button>
            <button 
              onClick={() => onReject(inv)}
              className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 text-xs"
            >
              رفض
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
