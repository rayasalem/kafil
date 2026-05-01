import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronUp, ChevronDown, Rocket } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const STEPS = [
  { path: '/dashboard/client', label: '1. إنشاء مشروع وإيداع الميزانية (Client)' },
  { path: '/projects/', label: '2. قفل الأموال في الضمان لكل مهمة (Client)' },
  { path: '/dashboard/freelancer', label: '3. قبول المهمة وتسليم العمل (Freelancer)' },
  { path: '/projects/', label: '4. اعتماد وتحرير الدفعة (Client)' },
  { path: '/dashboard/freelancer', label: '5. استلام الأرباح المحررة (Freelancer)' },
];

export const DemoGuide = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  if (location.pathname === '/' || location.pathname === '/login') return null;

  return (
    <div className="fixed right-6 bottom-6 z-[100] font-sans" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 w-80 rounded-2xl border border-blue-100 bg-white p-5 shadow-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-black text-[#0D1B2A]">
                <Rocket size={18} className="text-blue-500" /> مسار العرض (Demo Guide)
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronDown size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {STEPS.map((step, index) => {
                const isActive =
                  location.pathname.includes(step.path) ||
                  (location.pathname.startsWith('/projects') && step.path === '/projects/');
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3 rounded-lg p-2 transition-colors ${isActive ? 'border border-blue-100 bg-blue-50' : ''}`}
                  >
                    <div
                      className={`mt-0.5 flex-shrink-0 rounded-full p-0.5 ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                    >
                      <CheckCircle2 size={14} />
                    </div>
                    <span
                      className={`text-xs leading-5 font-bold ${isActive ? 'text-blue-900' : 'text-gray-500'}`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-3 text-center">
              <p className="text-[10px] font-bold text-gray-400">
                يمكنك التنقل بين الصلاحيات من الشريط العلوي
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700"
          title="فتح مسار العرض"
        >
          <Rocket size={24} />
        </motion.button>
      )}
    </div>
  );
};
