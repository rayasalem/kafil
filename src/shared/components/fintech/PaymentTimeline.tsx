import { FC } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Circle,
  Lock,
  ShieldCheck,
  Clock,
  ChevronRight,
  Receipt,
} from 'lucide-react';
import { PaymentStatus, TimelineEvent } from '@/types';
import { cn } from '@/shared/utils/cn';

interface PaymentTimelineProps {
  events: TimelineEvent[];
  currentStatus: PaymentStatus;
  className?: string;
}

const STEPS: PaymentStatus[] = [
  'Initiated',
  'Authorized',
  'Escrow Locked',
  'Awaiting Approval',
  'Released',
];

export const PaymentTimeline: FC<PaymentTimelineProps> = ({ events, currentStatus, className }) => {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className={cn('rounded-3xl border-2 border-gray-100 bg-white p-8', className)}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h4 className="flex items-center gap-2 text-xl font-black tracking-tight text-gray-900">
            <Lock size={20} className="text-[#C9A84C]" />
            Payment Journey
          </h4>
          <p className="mt-1 font-mono text-xs font-medium tracking-widest text-gray-400 uppercase">
            Transaction Security Protocol v2.4
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span className="text-[10px] font-black tracking-widest text-emerald-800 uppercase">
              Bank Grade Security
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex items-start justify-between">
        {/* Connection Lines */}
        <div className="absolute top-5 right-0 left-0 -z-0 mx-8 h-[2px] bg-gray-100" />
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: currentIndex / (STEPS.length - 1) }}
          style={{ originX: 0 }}
          className="absolute top-5 right-0 left-0 -z-0 mx-8 h-[2px] bg-emerald-500"
        />

        {STEPS.map((step, idx) => {
          const isCompleted = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          const event = events.find((e) => e.status === step);

          return (
            <div key={step} className="relative z-10 flex w-32 flex-col items-center gap-3">
              <motion.div
                animate={{
                  scale: isCurrent ? 1.2 : 1,
                  backgroundColor: isCompleted ? '#10b981' : '#ffffff',
                  borderColor: isCompleted ? '#10b981' : '#e5e7eb',
                }}
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 shadow-sm transition-all',
                  isCompleted ? 'text-white' : 'text-gray-400'
                )}
              >
                {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
              </motion.div>

              <div className="text-center">
                <span
                  className={cn(
                    'block text-[10px] font-black tracking-widest uppercase',
                    isCompleted ? 'text-gray-900' : 'text-gray-400'
                  )}
                >
                  {step}
                </span>
                {event && (
                  <span className="mt-1 block font-mono text-[8px] text-gray-400">
                    {new Date(event.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>

              {isCurrent && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-10 rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-black tracking-widest whitespace-nowrap text-white uppercase"
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
          className="mt-20 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-6"
        >
          <Receipt size={32} className="text-gray-400" />
          <div className="text-center">
            <h5 className="text-xs font-black tracking-widest text-gray-900 uppercase">
              Payment Receipt Generated
            </h5>
            <p className="mt-1 text-[10px] text-gray-500">
              Transaction completed and funds settled successfully.
            </p>
          </div>
          <button className="rounded-xl border border-gray-200 bg-white px-6 py-2 text-[10px] font-black tracking-widest text-gray-900 uppercase transition-all hover:border-gray-900">
            Download PDF Receipt
          </button>
        </motion.div>
      )}
    </div>
  );
};
