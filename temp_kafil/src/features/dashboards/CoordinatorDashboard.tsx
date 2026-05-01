import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function CoordinatorDashboard({ projects }) {
  return (
    <div className="animate-fade-in max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-1">لوحة المنسق</h1>
        <p className="text-gray-500 font-medium">متابعة إنجاز المشاريع دون صلاحيات مالية.</p>
      </div>
      
      <h2 className="text-xl font-bold text-gray-800 mb-6">متابعة المشاريع ({projects.length})</h2>
      <div className="grid lg:grid-cols-2 gap-5">
        {projects.map(p => (
          <Link key={p.id} to={`/projects/${p.id}`} className="bg-white border border-gray-100 p-6 rounded-3xl hover:border-purple-200 hover:shadow-lg transition-all group block">
            <h3 className="font-extrabold text-xl text-gray-900 mb-2">{p.title}</h3>
            <div className="text-sm text-gray-500 mb-4 flex items-center gap-2"><Activity size={16}/> المالك: {p.owner}</div>
            
            <div className="space-y-3">
               <p className="text-xs font-bold text-gray-400 uppercase">حالة المهام</p>
               {p.tasks.map(t => (
                 <div key={t.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg text-sm font-medium">
                   <span className="text-gray-800">{t.name}</span>
                   <span className={`px-2 py-1 rounded text-xs ${t.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{t.status || (t.paid ? 'مكتمل' : 'قيد التنفيذ')}</span>
                 </div>
               ))}
               {p.tasks.length === 0 && <p className="text-sm text-gray-400">لا توجد مهام.</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
