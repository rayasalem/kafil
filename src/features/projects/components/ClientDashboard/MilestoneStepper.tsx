import React from 'react';

interface Milestone {
  name: string;
  status: 'done' | 'review' | 'upcoming';
}

interface MilestoneStepperProps {
  milestones: Milestone[];
}

export const MilestoneStepper: React.FC<MilestoneStepperProps> = ({ milestones }) => (
  <div className="flex items-center gap-0 overflow-x-auto pb-1" role="list" aria-label="Project Milestones">
    {milestones.map((m, i) => (
      <div key={i} className="flex items-center shrink-0" role="listitem">
        <div className="flex flex-col items-center">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
            m.status === 'done' ? 'bg-[var(--color-kafil-gold)] border-[var(--color-kafil-gold)] text-white' :
            m.status === 'review' ? 'bg-[var(--color-kafil-teal)] border-[var(--color-kafil-teal)] text-white animate-pulse' :
            'bg-white border-gray-200 text-gray-300'
          }`} aria-current={m.status === 'review' ? 'step' : undefined}>
            {m.status === 'done' ? <span className="sr-only">Completed</span> : <span className="sr-only">Step {i + 1}</span>}
            {m.status === 'done' ? '✓' : i + 1}
          </div>
          <p className={`text-[9px] font-bold mt-1 whitespace-nowrap max-w-[60px] text-center leading-tight ${
            m.status === 'done' ? 'text-[var(--color-kafil-gold)]' :
            m.status === 'review' ? 'text-[var(--color-kafil-teal)]' : 'text-gray-300'
          }`}>{m.name}</p>
        </div>
        {i < milestones.length - 1 && (
          <div className={`h-0.5 w-8 mb-4 mx-0.5 ${m.status === 'done' ? 'bg-[var(--color-kafil-gold)]' : 'bg-gray-100'}`} aria-hidden="true" />
        )}
      </div>
    ))}
  </div>
);
