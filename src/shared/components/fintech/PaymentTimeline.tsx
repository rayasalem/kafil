import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  Lock, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Receipt
} from 'lucide-react';
import { PaymentStatus, TimelineEvent } from '@/types';
import { cn } from '@/shared/utils/cn';

interface PaymentTimelineProps {
  events: TimelineEvent[];
  currentStatus: PaymentStatus;
  className?: string;
}

const STEPS: PaymentStatus[] = ['Initiated', 'Authorized', 'Escrow Locked', 'Awaiting Approval', 'Released'];

export const PaymentTimeline: FC<PaymentTimelineProps> = ({ events, currentStatus, className }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className={cn("p-8 bg-white border-2 border-gray-100 rounded-3xl", className)}>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Lock size={20} className="text-[#C9A84C]" />
            Payment Journey
          </h4>
          <p className="text-xs text-gray-400 font-medium font-mono uppercase tracking-widest mt-1">Transaction Security Protocol v2.4</p>
        </div>
        <div className="flex gap-2">
            <div className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-emerald-50 border border-emerald-100">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Bank Grade Security</span>
            </div>
        </div>
      </div>

      <div className="relative flex justify-between items-start">
        {/* Connection Lines */}
        <div className="absolute top-5 left-0 right-0 h-[2px] bg-gray-100 -z-0 mx-8" />
        <motion.div 
          initial={{ scaleX: 0 }}
          animate={{ scaleX: (currentIndex) / (STEPS.length - 1) }}
          style={{ originX: 0 }}
          className="absolute top-5 left-0 right-0 h-[2px] bg-emerald-500 -z-0 mx-8" 
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const event = events.find(e => e.status === step);

          return (
            <div key={step} className="relative z-10 flex flex-col items-center gap-3 w-32">
              <motion.div 
                animate={{ 
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted ? "#10b981" : "#ffffff",
                  borderColor: isCompleted ? "#10b981" : "#e5e7eb"
                }}
                className={cn(
                  "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all shadow-sm",
                  isCompleted ? "text-white" : "text-gray-400"
                )}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </motion.div>
              
              <div className="text-center">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest block",
                  isCompleted ? "text-gray-900" : "text-gray-400"
                )}>
                  {step}
                </span>
                {event && (
                   <span className="text-[8px] text-gray-400 font-mono mt-1 block">
                     {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                )}
              </div>

              {isCurrent && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap"
                >
                  Live Status
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {currentStatus === 'Released' && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-20 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center gap-4"
        >
          <Receipt size={32} className="text-gray-400" />
          <div className="text-center">
            <h5 className="font-black text-gray-900 uppercase tracking-widest text-xs">Payment Receipt Generated</h5>
            <p className="text-[10px] text-gray-500 mt-1">Transaction completed and funds settled successfully.</p>
          </div>
          <button className="bg-white border border-gray-200 hover:border-gray-900 text-gray-900 px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
            Download PDF Receipt
          </button>
        </motion.div>
      )}
    </div>
  );
};
