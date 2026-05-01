import { KafilMark } from '@/components/KafilLogo';
import { Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CoordinatorDashboard({ projects }) {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { role: 'guest', name: 'Guest' };

  return (
    <div className="animate-fade-in mx-auto max-w-6xl space-y-10" dir="rtl">
      {/* Header & Reputation Badge */}
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-black tracking-tight text-[#0D1B2A]">
            لوحة المنسق (Lead)
          </h1>
          <p className="font-medium text-gray-500">أهلاً طارق! أنت الآن تدير 3 فرق عمل بنجاح.</p>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border-2 border-[#C9A84C] bg-white p-4 shadow-lg shadow-[#C9A84C]/10">
          <div className="rounded-xl bg-[#0D1B2A] p-3">
            <KafilMark size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-widest text-[#C9A84C] uppercase">
              Kafil Verified Lead
            </p>
            <p className="text-lg font-black text-[#0D1B2A]">
              ⭐ 4.9 <span className="mr-2 text-sm font-bold text-gray-400">| 24 مشروع</span>
            </p>
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-xl font-bold text-gray-800">متابعة المشاريع ({projects.length})</h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className="group block rounded-3xl border border-gray-100 bg-white p-6 transition-all hover:border-purple-200 hover:shadow-lg"
          >
            <h3 className="mb-2 text-xl font-extrabold text-gray-900">{p.title}</h3>
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
              <Activity size={16} /> المالك: {p.owner}
            </div>

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase">حالة المهام</p>
              {p.tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 p-3 text-sm font-medium"
                >
                  <span className="text-gray-800">{t.name}</span>
                  <span
                    className={`rounded px-2 py-1 text-xs ${t.paid ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}
                  >
                    {t.status || (t.paid ? 'مكتمل' : 'قيد التنفيذ')}
                  </span>
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
