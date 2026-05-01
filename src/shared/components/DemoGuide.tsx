import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronUp, ChevronDown, Rocket } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const STEPS = [
  { path: '/dashboard/client', label: '1. إنشاء مشروع وإيداع الميزانية (Client)' },
  { path: '/projects/', label: '2. قفل الأموال في الضمان لكل مهمة (Client)' },
  { path: '/dashboard/freelancer', label: '3. قبول المهمة وتسليم العمل (Freelancer)' },
  { path: '/projects/', label: '4. اعتماد وتحرير الدفعة (Client)' },
  { path: '/dashboard/freelancer', label: '5. استلام الأرباح المحررة (Freelancer)' }
];

export const DemoGuide = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl border border-blue-100 p-5 mb-4 w-80"
          >
            <div className="flex justify-between items-center mb-4">
               <h3 className="font-black text-[#0D1B2A] flex items-center gap-2">
                 <Rocket size={18} className="text-blue-500" /> مسار العرض (Demo Guide)
               </h3>
               <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <ChevronDown size={18} />
               </button>
            </div>
            
            <div className="space-y-3">
              {STEPS.map((step, index) => {
                 const isActive = location.pathname.includes(step.path) || (location.pathname.startsWith('/projects') && step.path === '/projects/');
                 return (
                   <div key={index} className={`flex items-start gap-3 p-2 rounded-lg transition-colors ${isActive ? 'bg-blue-50 border border-blue-100' : ''}`}>
                     <div className={`mt-0.5 rounded-full p-0.5 flex-shrink-0 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                       <CheckCircle2 size={14} />
                     </div>
                     <span className={`text-xs font-bold leading-5 ${isActive ? 'text-blue-900' : 'text-gray-500'}`}>
                       {step.label}
                     </span>
                   </div>
                 );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
               <p className="text-[10px] text-gray-400 font-bold">يمكنك التنقل بين الصلاحيات من الشريط العلوي</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors"
          title="فتح مسار العرض"
        >
          <Rocket size={24} />
        </motion.button>
      )}
    </div>
  );
};
