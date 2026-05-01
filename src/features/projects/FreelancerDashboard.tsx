import { useEffect, useState } from 'react';
import { Lock, CheckCircle, Upload, Send, X, Users, TrendingUp, FileText, ChevronLeft, Star, Shield, AlertCircle, Clock } from 'lucide-react';
import { api } from '@/services/api';
import { Project, User, Task } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

interface MyTask extends Task {
  projectName: string;
  projectId: string;
}

interface MyInvitation {
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

// Extended mock data for the modal
const MOCK_TEAM: Record<string, { name: string; role: string; payment: number; status: string; paid: boolean; avatar: string }[]> = {
  proj_1: [
    { name: 'Sara', role: 'UI Design', payment: 800, status: 'Completed', paid: true, avatar: 'S' },
    { name: 'Omar', role: 'Frontend', payment: 200, status: 'In Progress', paid: false, avatar: 'O' },
    { name: 'Lina', role: 'Backend', payment: 1000, status: 'Pending', paid: false, avatar: 'L' },
  ],
  proj_2: [
    { name: 'Sara', role: 'UX Wireframing', payment: 1000, status: 'Completed', paid: true, avatar: 'S' },
    { name: 'Lina', role: 'App Development', payment: 4000, status: 'Pending', paid: false, avatar: 'L' },
  ],
};

const MOCK_MILESTONES: Record<string, { id: string; name: string; amount: number; due: string; status: string }[]> = {
  proj_1: [
    { id: 'm1', name: 'تصميم الواجهات', amount: 100, due: '10 يونيو', status: 'done' },
    { id: 'm2', name: 'تطوير الصفحة الرئيسية', amount: 200, due: '20 يونيو', status: 'active' },
  ],
  proj_2: [
    { id: 'm3', name: 'رسوم الهيكلية', amount: 200, due: '5 يونيو', status: 'done' },
    { id: 'm4', name: 'التطوير الكامل', amount: 800, due: '25 يونيو', status: 'active' },
  ],
};

const avatarColors: Record<string, string> = {
  S: 'bg-purple-100 text-purple-700',
  O: 'bg-blue-100 text-blue-700',
  L: 'bg-teal-100 text-teal-700',
};


export default function FreelancerDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedTask, setSelectedTask] = useState<MyTask | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string>('');
  const [requestSent, setRequestSent] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<MyInvitation | null>(null);

  const user: User = JSON.parse(localStorage.getItem('user') || 'null') || {
    id: 'user_freelancer_1',
    role: 'freelancer',
    name: 'عمر العلي',
    username: 'omar_dev',
    email: 'omar@freelance.sa',
    avatar: 'OA',
    joinedAt: '2025-02-15',
  };

  useEffect(() => {
    api.getProjects().then(setProjects);
  }, []);

  const handleAcceptInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Accepted');
      api.getProjects().then(setProjects);
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectInvite = async (inv: MyInvitation) => {
    try {
      await api.updateInviteStatus(inv.projectId, inv.id, 'Rejected');
      api.getProjects().then(setProjects);
      if (selectedInvitation?.id === inv.id) setSelectedInvitation(null);
    } catch (e) {
      console.error(e);
    }
  };

  let myTasks: MyTask[] = [];
  let myInvitations: MyInvitation[] = [];
  let myEarnings = 0;
  let escrowed = 0;

  projects.forEach(p => {
    p.tasks.forEach(t => {
      const match =
        t.assignedTo === user.id ||
        (user.email && t.assignedToEmail?.toLowerCase() === user.email.toLowerCase()) ||
        // fallback for legacy name-based tasks
        t.assignedTo === user.username ||
        (user.name && t.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()));

      if (match) {
        if (t.inviteStatus === 'Pending') {
          myInvitations.push({
            id: t.id,
            projectId: p.id,
            projectName: p.title,
            taskName: t.name,
            budget: t.payment,
            deadline: t.deadline ?? 'مفتوح',
            sender: p.owner,
            senderRole: 'مدير المشروع',
            description: t.description ?? 'لقد تمت دعوتك للعمل على هذه المهمة. يرجى مراجعة التفاصيل أدناه لتقرير قبول الانضمام أو الرفض.',
            requirements: [t.name, 'الالتزام بمواعيد التسليم', 'تسليم العمل بجودة عالية'],
            attachments: []
          });
        } else if (t.inviteStatus !== 'Rejected') {
          myTasks.push({ ...t, projectName: p.title, projectId: p.id });
          if (t.paid) myEarnings += t.payment;
          else escrowed += t.payment;
        }
      }
    });
  });

  const team = selectedTask ? (MOCK_TEAM[selectedTask.projectId] || []) : [];
  const milestones = selectedTask ? (MOCK_MILESTONES[selectedTask.projectId] || []) : [];
  const project = selectedTask ? projects.find(p => p.id === selectedTask.projectId) : null;
  const totalPaid = project ? project.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0) : 0;
  const totalAllocated = project ? project.tasks.reduce((s, t) => s + t.payment, 0) : 0;

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    Completed: { label: 'مكتمل', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    'In Progress': { label: 'قيد التنفيذ', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
    Pending: { label: 'في الانتظار', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
    Disputed: { label: 'نزاع مفتوح', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  };

  return (
    <div className="animate-fade-in max-w-5xl mx-auto" dir="rtl">

      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1" style={{ color: '#0D1B2A' }}>
            لوحة المستقل
          </h1>
          <p className="text-gray-500 font-medium">مرحباً {user.name}! أموالك محمية في كفيل.</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-[#E8DDD0] px-4 py-2 rounded-2xl shadow-sm">
          <Shield size={16} className="text-[#C9A84C]" />
          <span className="text-sm font-bold text-[#0D1B2A]">كفيل ضامنوك</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <CheckCircle size={14} className="text-emerald-500" /> الأرباح المستلمة
          </p>
          <p className="text-4xl font-black" style={{ color: '#0D1B2A' }}>{formatCurrency(myEarnings)}</p>
        </div>
        <div className="p-6 rounded-3xl shadow-lg" style={{ background: '#0D1B2A' }}>
          <p className="text-xs font-bold text-blue-200 uppercase mb-2 flex items-center gap-2">
            <Lock size={14} /> محجوز في كفيل (Escrow)
          </p>
          <p className="text-4xl font-black text-white">{formatCurrency(escrowed)}</p>
        </div>
        <div className="bg-white border border-[#E8DDD0] p-6 rounded-3xl shadow-sm">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Star size={14} className="text-[#C9A84C]" /> المهام النشطة
          </p>
          <p className="text-4xl font-black" style={{ color: '#0D1B2A' }}>{myTasks.filter(t => !t.paid).length}</p>
        </div>
      </div>

      {/* Invitations Section */}
      {myInvitations.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: '#0D1B2A' }}>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            دعوات مشاريع جديدة ({myInvitations.length})
          </h2>
          <div className="grid gap-4">
            {myInvitations.map(inv => (
              <div key={inv.id} className="bg-white border-2 border-blue-100 p-6 rounded-2xl shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full bg-blue-500"></div>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-md uppercase tracking-widest">دعوة عمل</span>
                      <span className="text-xs text-gray-500 font-medium">من: {inv.sender} ({inv.senderRole})</span>
                    </div>
                    <h3 className="font-black text-xl text-[#0D1B2A] mb-1">{inv.projectName}</h3>
                    <p className="text-sm font-bold text-gray-600 mb-4">المهمة: <span className="text-[#0D1B2A]">{inv.taskName}</span></p>
                    
                    <div className="flex gap-6 mb-4 md:mb-0">
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
                      onClick={() => handleAcceptInvite(inv)}
                      className="w-full bg-[#1A7F74] text-white font-black py-2.5 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 text-sm"
                    >
                      قبول الانضمام
                    </button>
                    <div className="flex gap-2 w-full">
                      <button 
                        onClick={() => setSelectedInvitation(inv)}
                        className="flex-1 bg-gray-50 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-100 transition-colors text-xs"
                      >
                        عرض التفاصيل
                      </button>
                      <button 
                        onClick={() => handleRejectInvite(inv)}
                        className="flex-1 bg-white border border-red-200 text-red-600 font-bold py-2.5 rounded-xl hover:bg-red-50 transition-colors text-xs"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tasks List */}
      <h2 className="text-xl font-bold mb-5" style={{ color: '#0D1B2A' }}>
        المهام المسندة إليك ({myTasks.length})
      </h2>

      {myTasks.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-[#E8DDD0] rounded-3xl p-16 text-center">
          <p className="text-gray-400 font-bold text-lg">لا توجد مهام مسندة حالياً.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {myTasks.map(t => {
            const sc = statusConfig[t.status] || statusConfig['Pending'];
            return (
              <button
                key={t.id}
                onClick={() => { setSelectedTask(t); setUploadedFile(''); setRequestSent(false); }}
                className="w-full text-right bg-white border border-[#E8DDD0] p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-[#C9A84C]/30 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: t.paid ? '#f0fdf4' : '#eff6ff' }}>
                    {t.paid ? <CheckCircle size={22} className="text-emerald-600" /> : <Lock size={22} className="text-blue-600" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg" style={{ color: '#0D1B2A' }}>{t.name}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{t.projectName}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border mt-1 ${sc.bg} ${sc.color}`}>
                      {sc.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="block text-2xl font-black" style={{ color: '#0D1B2A' }}>{formatCurrency(t.payment)}</span>
                    {t.paid
                      ? <span className="text-xs font-bold text-emerald-600">تم الدفع ✔</span>
                      : <span className="text-xs font-bold text-[#C9A84C] flex items-center gap-1"><Lock size={10} /> محجوز بكفيل</span>
                    }
                  </div>
                  <ChevronLeft size={18} className="text-gray-300 group-hover:text-[#C9A84C] transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Invitation Detail Modal */}
      {selectedInvitation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#F9F4EE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" dir="rtl">
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#E8DDD0]" style={{ background: '#F9F4EE' }}>
              <div>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">تفاصيل دعوة العمل</p>
                <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>{selectedInvitation.projectName}</h2>
              </div>
              <button onClick={() => setSelectedInvitation(null)} className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Top Meta Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المهمة</p>
                  <p className="text-sm font-bold text-[#0D1B2A]">{selectedInvitation.taskName}</p>
                </div>
                <div className="bg-white border border-[#C9A84C] p-4 rounded-2xl text-center shadow-sm">
                  <p className="text-[10px] font-black text-[#C9A84C] uppercase mb-1">الميزانية المقترحة</p>
                  <p className="text-lg font-black text-[#0D1B2A]">{formatCurrency(selectedInvitation.budget)}</p>
                </div>
                <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">الموعد النهائي</p>
                  <p className="text-sm font-bold text-[#0D1B2A]">{selectedInvitation.deadline}</p>
                </div>
                <div className="bg-white border border-[#E8DDD0] p-4 rounded-2xl text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المرسل</p>
                  <p className="text-sm font-bold text-[#0D1B2A]">{selectedInvitation.sender}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
                <h3 className="font-bold text-[#0D1B2A] mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-[#C9A84C]" /> نبذة عن المشروع
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {selectedInvitation.description}
                </p>
              </div>

              {/* Requirements */}
              <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
                <h3 className="font-bold text-[#0D1B2A] mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-[#1A7F74]" /> المتطلبات والمهام المطلوبة منك
                </h3>
                <ul className="space-y-2">
                  {selectedInvitation.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full mt-1.5 shrink-0"></div>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Attachments */}
              <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
                <h3 className="font-bold text-[#0D1B2A] mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-blue-500" /> المرفقات لتوضيح العمل
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedInvitation.attachments.map((file, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl text-xs font-bold text-gray-700">
                      <FileText size={14} className="text-[#C9A84C]" /> {file}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white border-t border-[#E8DDD0] p-6 flex items-center gap-4">
              <button 
                onClick={() => handleAcceptInvite(selectedInvitation)}
                className="flex-1 bg-[#1A7F74] text-white font-black py-4 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-900/20 text-center"
              >
                قبول الانضمام والالتزام بالميزانية
              </button>
              <button 
                onClick={() => handleRejectInvite(selectedInvitation)}
                className="px-8 py-4 bg-white border border-red-200 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-colors text-center"
              >
                رفض العرض
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(13,27,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-[#F9F4EE] w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl" dir="rtl">

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-[#E8DDD0]" style={{ background: '#F9F4EE' }}>
              <div>
                <h2 className="text-xl font-black" style={{ color: '#0D1B2A' }}>{selectedTask.name}</h2>
                <p className="text-sm text-gray-500">{selectedTask.projectName}</p>
              </div>
              <button onClick={() => setSelectedTask(null)} className="w-9 h-9 rounded-xl bg-white border border-[#E8DDD0] flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-colors">
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* My Allocation Card */}
              <div className="rounded-2xl p-5 border-2 border-[#C9A84C]" style={{ background: 'rgba(201,168,76,0.06)' }}>
                <p className="text-xs font-black text-[#C9A84C] uppercase tracking-widest mb-1 flex items-center gap-2">
                  <Lock size={12} /> حصتك المحجوزة في كفيل
                </p>
                <p className="text-4xl font-black mb-2" style={{ color: '#0D1B2A' }}>{formatCurrency(selectedTask.payment)}</p>
                <p className="text-sm text-gray-500">✅ الأموال محفوظة في الضمان · ✅ تُصرف مباشرة لك · ✅ لا يمكن لأحد المساس بها</p>
              </div>

              {/* Money Flow */}
              {project && (
                <div className="bg-white rounded-2xl p-5 border border-[#E8DDD0]">
                  <h3 className="font-bold text-sm text-gray-500 uppercase mb-3 flex items-center gap-2">
                    <TrendingUp size={14} /> التدفق المالي للمشروع
                  </h3>
                  <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                    <span>الميزانية الكلية: <span className="text-[#0D1B2A]">{formatCurrency(project.budget)}</span></span>
                    <span>المُصرف: <span className="text-emerald-600">{formatCurrency(totalPaid)}</span></span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${project.budget ? (totalPaid / project.budget) * 100 : 0}%` }} />
                    <div className="h-full bg-[#C9A84C] opacity-70 transition-all duration-700" style={{ width: `${project.budget ? ((totalAllocated - totalPaid) / project.budget) * 100 : 0}%` }} />
                  </div>
                  <div className="flex gap-4 mt-3 text-xs font-bold">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block" /> صُرف</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#C9A84C] inline-block" /> محجوز</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-gray-200 inline-block" /> متاح</span>
                  </div>
                </div>
              )}

              {/* Team Members */}
              {team.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-[#E8DDD0]">
                  <h3 className="font-bold text-sm text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <Users size={14} /> فريق المشروع
                  </h3>
                  <div className="space-y-3">
                    {team.map((m, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-xl border ${m.name === (user.name || 'Omar') ? 'border-[#C9A84C]/40 bg-[#C9A84C]/5' : 'border-[#E8DDD0] bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${avatarColors[m.avatar] || 'bg-gray-100 text-gray-600'}`}>
                            {m.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-sm" style={{ color: '#0D1B2A' }}>
                              {m.name} {m.name === (user.name || 'Omar') && <span className="text-[#C9A84C] text-xs">(أنت)</span>}
                            </p>
                            <p className="text-xs text-gray-400">{m.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-sm" style={{ color: '#0D1B2A' }}>{formatCurrency(m.payment)}</p>
                          <span className={`text-[10px] font-bold ${m.paid ? 'text-emerald-600' : 'text-[#C9A84C]'}`}>
                            {m.paid ? '✔ مدفوع' : '🔒 محجوز'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Milestones */}
              {milestones.length > 0 && (
                <div className="bg-white rounded-2xl p-5 border border-[#E8DDD0]">
                  <h3 className="font-bold text-sm text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <Clock size={14} /> المراحل
                  </h3>
                  <div className="space-y-2">
                    {milestones.map((m, i) => (
                      <div key={m.id} className={`flex items-center justify-between p-3 rounded-xl border ${m.status === 'done' ? 'border-emerald-200 bg-emerald-50' : 'border-blue-200 bg-blue-50'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${m.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'}`}>
                            {i + 1}
                          </div>
                          <p className="font-bold text-sm" style={{ color: '#0D1B2A' }}>{m.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-sm">{formatCurrency(m.amount)}</p>
                          <p className="text-xs text-gray-400">{m.due}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Work & Request Payment */}
              {!selectedTask.paid && (
                <div className="bg-white rounded-2xl p-5 border border-[#E8DDD0]">
                  <h3 className="font-bold text-sm text-gray-500 uppercase mb-4 flex items-center gap-2">
                    <Upload size={14} /> تسليم العمل وطلب الدفع
                  </h3>

                  {requestSent ? (
                    <div className="text-center py-6">
                      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-3">
                        <CheckCircle size={28} className="text-emerald-600" />
                      </div>
                      <p className="font-black text-lg text-emerald-700">تم إرسال الطلب بنجاح!</p>
                      <p className="text-sm text-gray-500 mt-1">سيتم مراجعة عملك وصرف مستحقاتك عند الاعتماد.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* File Upload */}
                      <div>
                        <label className="block text-sm font-bold text-gray-600 mb-2">رفع الملفات</label>
                        <label className={`flex flex-col items-center justify-center w-full h-28 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploadedFile ? 'border-emerald-400 bg-emerald-50' : 'border-[#E8DDD0] bg-[#F9F4EE] hover:border-[#C9A84C]'}`}>
                          <input type="file" className="hidden" onChange={e => setUploadedFile(e.target.files?.[0]?.name || '')} />
                          {uploadedFile ? (
                            <div className="text-center">
                              <FileText size={24} className="text-emerald-600 mx-auto mb-1" />
                              <p className="text-sm font-bold text-emerald-700">{uploadedFile}</p>
                            </div>
                          ) : (
                            <div className="text-center">
                              <Upload size={24} className="text-gray-300 mx-auto mb-1" />
                              <p className="text-sm text-gray-400">اضغط لرفع ملف التسليم</p>
                            </div>
                          )}
                        </label>
                      </div>

                      {/* Warning */}
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                        <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-700">بمجرد إرسال الطلب سيتم إشعار صاحب المشروع لمراجعة العمل واعتماد الدفعة.</p>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={async () => { 
                          if (uploadedFile && selectedTask) {
                            try {
                              await api.submitTaskWork(selectedTask.projectId, selectedTask.id, {
                                deliverableFile: uploadedFile,
                                deliverableNote: 'تم تسليم العمل بنجاح'
                              });
                              setRequestSent(true);
                              api.getProjects().then(setProjects);
                            } catch (e) {
                              console.error('Failed to submit work', e);
                            }
                          } 
                        }}
                        className={`w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all ${uploadedFile ? 'text-white shadow-lg hover:-translate-y-0.5' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        style={uploadedFile ? { background: '#C9A84C', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' } : {}}
                        disabled={!uploadedFile}
                      >
                        <Send size={18} /> إرسال العمل وطلب مستحقاتي ({formatCurrency(selectedTask.payment)})
                      </button>
                    </div>
                  )}
                </div>
              )}

              {selectedTask.paid && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                  <CheckCircle size={32} className="text-emerald-600 mx-auto mb-2" />
                  <p className="font-black text-emerald-700 text-lg">تم صرف مستحقاتك</p>
                  <p className="text-sm text-emerald-600">{formatCurrency(selectedTask.payment)} · تم الدفع بنجاح</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
