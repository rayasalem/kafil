import { useEffect, useState, FC, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, Send } from 'lucide-react';
import TaskItem from '@/features/projects/TaskItem';
import MoneyFlowBar from '@/features/escrow/MoneyFlowBar';
import { api } from '@/services/api';
import { Project, User } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

const ProjectDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [payment, setPayment] = useState('');

  const userStr = localStorage.getItem('user');
  const user: User = userStr ? JSON.parse(userStr) : { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const loadProject = () => {
    if (id) {
      api.getProject(id).then(setProject).catch(console.error);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    if (id) {
      await api.addTask(id, { name, assignedTo, payment: Number(payment) });
      setName('');
      setAssignedTo('');
      setPayment('');
      loadProject();
    }
  };

  const completeTask = async (taskId: string) => {
    if (!window.confirm('الإفراج عن الدفعة نهائي. تأكيد؟')) return;
    if (id) {
      await api.completeTask(id, taskId);
      loadProject();
    }
  };

  if (!project) return <div className="p-10 text-center font-bold text-gray-500">جاري تحميل الخزنة...</div>;

  const totalPaid = project.tasks.filter(t => t.paid).reduce((s, t) => s + t.payment, 0);
  const totalAllocated = project.tasks.reduce((s, t) => s + t.payment, 0);
  const remainingBudget = project.budget - totalAllocated;

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="bg-white border border-gray-100 rounded-3xl p-8 mb-8 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{project.title}</h1>
              <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 border border-emerald-100 shadow-sm">
                <Lock size={14}/> 💰 الأموال محفوظة في كفيل
              </span>
            </div>
            <p className="text-gray-400 font-medium">المدير: <span className="text-gray-600">{project.owner}</span></p>
          </div>
          <div className="text-right bg-gray-50 p-5 rounded-2xl border border-gray-100 min-w-[200px]">
            <span className="block text-sm font-bold text-gray-400 mb-1 uppercase">الميزانية الإجمالية</span>
            <span className="block text-4xl font-black text-blue-900 tracking-tight">{formatCurrency(project.budget)}</span>
          </div>
        </div>

        <MoneyFlowBar budget={project.budget} paid={totalPaid} allocated={totalAllocated} />
      </div>

      <div className="flex justify-between items-end mb-5">
        <h2 className="text-2xl font-bold text-gray-800">المهام التعاقدية</h2>
      </div>

      {(user.role === 'client' || user.role === 'admin') && (
        <form onSubmit={addTask} className="flex flex-col lg:flex-row gap-4 mb-8 bg-white border border-gray-100 p-3 rounded-2xl items-end shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <div className="flex-1 w-full"><input className="border-0 bg-gray-50 p-4 w-full rounded-xl focus:bg-blue-50/50 focus:ring-0 outline-none font-medium placeholder-gray-400" placeholder="وصف المهمة (مثال: برمجة الواجهة)" value={name} onChange={e=>setName(e.target.value)} required/></div>
          <div className="w-full lg:w-64"><input className="border-0 bg-gray-50 p-4 w-full rounded-xl focus:bg-blue-50/50 focus:ring-0 outline-none font-medium placeholder-gray-400" placeholder="اسم حساب المستقل" value={assignedTo} onChange={e=>setAssignedTo(e.target.value)} required/></div>
          <div className="w-full lg:w-40"><input className="border-0 bg-gray-50 p-4 w-full rounded-xl focus:bg-blue-50/50 focus:ring-0 outline-none font-medium text-left placeholder-gray-400" dir="ltr" type="number" min="1" max={remainingBudget} placeholder="المبلغ $" value={payment} onChange={e=>setPayment(e.target.value)} required/></div>
          <button className="bg-gray-900 text-white font-bold px-6 py-4 rounded-xl w-full lg:w-auto hover:bg-gray-800 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 shadow-lg shadow-gray-900/10 whitespace-nowrap">
            <Send size={18}/> أضف للسجل
          </button>
        </form>
      )}

      <div className="space-y-4">
        {project.tasks.map(t => <TaskItem key={t.id} t={t} onApprove={completeTask} userRole={user.role} />)}
        {project.tasks.length === 0 && (
          <div className="text-center py-16 text-gray-400 border-2 border-dashed border-gray-100 rounded-3xl bg-white font-medium shadow-sm">
            الخزنة جاهزة. ابدأ بإضافة المهام والمدفوعات بالأعلى.
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
