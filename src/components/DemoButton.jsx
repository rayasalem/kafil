import { Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api.js';

export default function DemoButton() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDemo = async () => {
    localStorage.setItem('user', JSON.stringify({ name: 'Ahmed Khaled', username: 'ahmed_client', role: 'client' }));
    
    const proj = await api.createProject({ title: 'E-commerce Website', budget: 3000, owner: 'Ahmed Khaled', ownerUsername: 'ahmed_client' });
    
    const tasks = [
      { name: 'UI Design', assignedTo: 'Sara', payment: 800, status: 'Completed', paid: true },
      { name: 'Frontend', assignedTo: 'Omar', payment: 200, status: 'In Progress', paid: false }, 
      { name: 'Backend', assignedTo: 'Lina', payment: 1000, status: 'Pending', paid: false } 
    ];

    for (let t of tasks) {
      await api.addTask(proj.id, t);
    }

    if (location.pathname.startsWith('/projects/')) {
        window.location.href = `/projects/${proj.id}`;
    } else {
        navigate(`/projects/${proj.id}`);
    }
  };

  return (
    <button onClick={handleDemo} className="w-full flex items-center justify-center gap-2 bg-gradient-to-l from-blue-700 to-indigo-800 text-white px-4 py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all font-black text-[15px] select-none border border-indigo-500 hover:-translate-y-0.5">
      <Zap size={20} className="fill-current text-yellow-300"/> 
      شغّل نسخة الهاكاثون
    </button>
  );
}
