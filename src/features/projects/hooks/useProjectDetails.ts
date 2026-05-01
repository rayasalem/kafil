import { useState, useEffect, FormEvent } from 'react';
import { api } from '@/services/api';
import { Project, Task } from '@/types';
import { toast } from 'sonner';

export function useProjectDetails(projectId: string | undefined) {
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [freelancerQuery, setFreelancerQuery] = useState('');
  const [resolvedFreelancer, setResolvedFreelancer] = useState<{ name: string; email: string } | null>(null);
  const [payment, setPayment] = useState('');
  const [disputeTarget, setDisputeTarget] = useState<{ project: Project; task: Task } | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadProject = () => {
    if (projectId) api.getProject(projectId).then(setProject).catch(console.error);
  };

  useEffect(() => { loadProject(); }, [projectId]);

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (projectId) {
      try {
        await api.addTask(projectId, { name, freelancerQuery, payment: Number(payment) });
        toast.success(`تمت إضافة المهمة وإرسال الدعوة`);
        setName(''); setFreelancerQuery(''); setPayment(''); setResolvedFreelancer(null);
        loadProject();
      } catch (err: any) {
        toast.error(err.message || 'فشل إضافة المهمة');
      }
    }
  };

  const completeTask = async (taskId: string) => {
    if (!window.confirm('الإفراج عن الدفعة نهائي. تأكيد؟')) return;
    if (projectId) {
      try {
        await api.completeTask(projectId, taskId);
        toast.success('تم صرف الدفعة بنجاح');
        loadProject();
      } catch { toast.error('فشل صرف الدفعة'); }
    }
  };

  const lookupFreelancer = async (query: string) => {
    setFreelancerQuery(query);
    setResolvedFreelancer(null);
    if (query.length > 2) {
      const found = await api.lookupUser(query);
      if (found) setResolvedFreelancer({ name: found.name, email: found.email });
    }
  };

  const totalPaid = project ? project.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0) : 0;
  const totalAllocated = project ? project.tasks.reduce((s, t) => s + t.payment, 0) : 0;
  const remainingBudget = project ? project.budget - totalAllocated : 0;
  const openDisputesCount = project ? project.tasks.filter(t => t.status === 'Disputed').length : 0;

  return {
    project,
    form: { name, setName, freelancerQuery, lookupFreelancer, resolvedFreelancer, payment, setPayment },
    modals: { disputeTarget, setDisputeTarget, selectedTask, setSelectedTask },
    stats: { totalPaid, totalAllocated, remainingBudget, openDisputesCount },
    actions: { addTask, completeTask }
  };
}
