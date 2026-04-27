export default function MoneyFlowBar({ budget, paid, allocated }) {
  const remainingBudget = budget - allocated;
  const inProgressBudget = allocated - paid;

  const getWidth = (val) => `${(val / budget) * 100}%`;

  return (
    <div>
      <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        حركة التدفق المالي للمشروع
      </p>
      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden flex shadow-inner">
        <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: getWidth(paid) }} title="مُسددة"></div>
        <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: getWidth(inProgressBudget) }} title="محجوزة (قيد التنفيذ)"></div>
        <div className="bg-gray-200 h-full transition-all duration-1000" style={{ width: getWidth(remainingBudget) }} title="غير مخصصة"></div>
      </div>
      <div className="flex justify-between text-xs font-bold text-gray-500 mt-3 px-1">
        <span className="text-emerald-600 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></span> مُسددة: ${paid}</span>
        <span className="text-amber-600 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm"></span> قيد التنفيذ: ${inProgressBudget}</span>
        <span className="text-gray-400 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-300 shadow-sm"></span> في الخزنة: ${remainingBudget}</span>
      </div>
    </div>
  );
}
