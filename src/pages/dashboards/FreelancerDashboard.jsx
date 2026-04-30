import { useEffect, useState } from 'react';
import { Lock, CheckCircle } from 'lucide-react';
import { api } from '../../services/api.js';

export default function FreelancerDashboard() {
  const [projects, setProjects] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'freelancer', name: 'Omar', username: 'omar' };

  useEffect(() => {
    api.getProjects().then(data => {
         setProjects(data);
      });
  }, []);

  let myTasks = [];
  let myEarnings = 0;
  let expectedEarnings = 0;
  
  projects.forEach(p => {
     p.tasks.forEach(t => {
       if (user.name && t.assignedTo.toLowerCase().includes(user.name.split(' ')[0].toLowerCase())) {
         myTasks.push({...t, projectName: p.title, projectId: p.id});
         if (t.paid) myEarnings += t.payment;
         else expectedEarnings += t.payment;
       } else if (user.username === 'omar_dev' && t.assignedTo === 'Omar') {
         myTasks.push({...t, projectName: p.title, projectId: p.id});
         if (t.paid) myEarnings += t.payment;
         else expectedEarnings += t.payment;
       }
     });
  });

  if (myTasks.length === 0) {
     projects.forEach(p => {
       p.tasks.forEach(t => {
         if (t.assignedTo === 'Omar' || t.assignedTo === 'ياسر (مطور واجهات)') {
            myTasks.push({...t, projectName: p.title, projectId: p.id});
            if (t.paid) myEarnings += t.payment;
            else expectedEarnings += t.payment;
         }
       });
     });
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">لوحة المستقل</h1>
        <p className="text-gray-500 font-medium">مرحباً بك! تابع مهامك ومستحقاتك بأمان تام.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-5 mb-12">
        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-emerald-600 uppercase mb-1">الأرباح المستلمة</p>
             <p className="text-4xl font-black text-emerald-900">${myEarnings}</p>
           </div>
           <div className="bg-emerald-200 text-emerald-700 p-4 rounded-full"><CheckCircle size={32}/></div>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl shadow-sm flex items-center justify-between">
           <div>
             <p className="text-sm font-bold text-blue-600 uppercase mb-1">الدفعات المحجوزة لدى كفيل</p>
             <p className="text-4xl font-black text-blue-900">${expectedEarnings}</p>
           </div>
           <div className="bg-blue-200 text-blue-700 p-4 rounded-full"><Lock size={32}/></div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-6">المهام المسندة إليك ({myTasks.length})</h2>
      <div className="grid gap-4">
        {myTasks.length === 0 ? <p className="text-gray-500">لا توجد مهام مسندة حالياً.</p> : myTasks.map(t => (
          <div key={t.id} className="bg-white border border-gray-100 p-5 rounded-2xl flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{t.name} <span className="text-sm text-gray-400 font-medium ml-2">({t.projectName})</span></h3>
              <p className="text-sm text-gray-500 mt-1">الحالة: {t.status || (t.paid ? 'مكتمل' : 'قيد التنفيذ')}</p>
            </div>
            <div className="text-right md:text-left bg-gray-50 p-4 rounded-xl border border-gray-100 shrink-0">
              <span className="block text-2xl font-black text-gray-900">${t.payment}</span>
              {t.paid ? <span className="text-xs font-bold text-emerald-600">تم الدفع ✔</span> : <span className="text-xs font-bold text-blue-600 flex items-center justify-end gap-1"><Lock size={12}/> محجوز في السند</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
