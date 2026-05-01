import { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { Project, User, Task } from '@/types';
import { toast } from 'sonner';

export interface MyTask extends Task {
  projectName: string;
  projectId: string;
}

export interface MyInvitation {
  id: string;
  projectId: string;
  projectName: string;
  taskName: string;
  budget: number;
  deadline: string;
  sender: string;
  senderRole: string;
  description: string;
  requirements: string[];
  attachments: string[];
}

export function useFreelancerDashboard(user: User | null) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<MyTask | null>(null);
  const [selectedInvitation, setSelectedInvitation] = useState<MyInvitation | null>(null);

  const loadData = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      toast.error('فشل تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const { myTasks, myInvitations, myEarnings, escrowed } = useMemo(() => {
    const tasks: MyTask[] = [];
    const invitations: MyInvitation[] = [];
    let earnings = 0;
    let inEscrow = 0;

    if (!user) return { myTasks: tasks, myInvitations: invitations, myEarnings: earnings, escrowed: inEscrow };

    projects.forEach(p => {
      p.tasks.forEach(t => {
        const isAssigned = 
          t.assignedTo === user.id || 
          t.assignedTo === user.username || 
          (user.email && t.assignedToEmail?.toLowerCase() === user.email.toLowerCase());

        if (isAssigned) {
          if (t.inviteStatus === 'Pending') {
            invitations.push({
              id: t.id,
              projectId: p.id,
              projectName: p.title,
              taskName: t.name,
              budget: t.payment,
              deadline: t.deadline ?? 'مفتوح',
              sender: p.owner,
              senderRole: 'مدير المشروع',
              description: t.description ?? 'لقد تمت دعوتك للعمل على هذه المهمة.',
              requirements: [t.name, 'الالتزام بمواعيد التسليم'],
              attachments: []
            });
          } else if (t.inviteStatus !== 'Rejected') {
            tasks.push({ ...t, projectName: p.title, projectId: p.id });
            if (t.paid) earnings += t.payment;
            else inEscrow += t.payment;
          }
        }
      });
    });

    return { myTasks: tasks, myInvitations: invitations, myEarnings: earnings, escrowed: inEscrow };
  }, [projects, user]);

  const acceptInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Accepted');
      toast.success('تم قبول الدعوة بنجاح');
      loadData();
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) {
      toast.error('فشل قبول الدعوة');
    }
  };

  const rejectInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Rejected');
      toast.info('تم رفض الدعوة');
      loadData();
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) {
      toast.error('فشل رفض الدعوة');
    }
  };

  const submitWork = async (projectId: string, taskId: string, fileName: string) => {
    try {
      await api.submitTaskWork(projectId, taskId, {
        deliverableFile: fileName,
        deliverableNote: 'تم تسليم العمل بنجاح'
      });
      toast.success('تم تسليم العمل للمراجعة');
      loadData();
      return true;
    } catch (e) {
      toast.error('فشل تسليم العمل');
      return false;
    }
  };

  return {
    loading,
    myTasks,
    myInvitations,
    stats: { myEarnings, escrowed },
    modals: { selectedTask, setSelectedTask, selectedInvitation, setSelectedInvitation },
    actions: { acceptInvite, rejectInvite, submitWork }
  };
}
