import { FC } from 'react';

interface MoneyFlowBarProps {
  budget: number;
  paid: number;
  allocated: number;
}

const MoneyFlowBar: FC<MoneyFlowBarProps> = ({ budget, paid, allocated }) => {
  const remaining = budget - allocated;
  const paidWidth = (paid / budget) * 100;
  const allocatedWidth = ((allocated - paid) / budget) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
        <span>توزيع التدفق المالي</span>
        <span>الرصيد المتاح: <span className="text-blue-600">${remaining.toLocaleString()}</span></span>
      </div>
      <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
        <div 
          className="h-full bg-emerald-500 transition-all duration-1000 ease-out" 
          style={{ width: `${paidWidth}%` }}
          title={`تم صرفه: $${paid.toLocaleString()}`}
        />
        <div 
          className="h-full bg-blue-500 transition-all duration-1000 ease-out opacity-80" 
          style={{ width: `${allocatedWidth}%` }}
          title={`محجوز بالخزنة: $${(allocated - paid).toLocaleString()}`}
        />
      </div>
      <div className="flex gap-6 mt-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-emerald-500"></span>
          <span className="text-sm font-bold text-gray-600">تم صرفه (${paid.toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-blue-500"></span>
          <span className="text-sm font-bold text-gray-600">محجوز بالخزنة (${(allocated - paid).toLocaleString()})</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-gray-200"></span>
          <span className="text-sm font-bold text-gray-600">متاح للمهام القادمة (${remaining.toLocaleString()})</span>
        </div>
      </div>
    </div>
  );
};

export default MoneyFlowBar;
