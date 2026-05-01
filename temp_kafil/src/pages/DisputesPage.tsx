import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Clock, CheckCircle, AlertTriangle, ChevronLeft, Scale, FileText } from 'lucide-react';
import { User } from '@/types';

const MY_DISPUTES = [
  {
    id: 'KF-2847',
    title: 'نزاع تصميم واجهات — E-commerce App',
    against: 'Sara A.',
    amount: 600,
    status: 'open',
    role: 'requester',
    filed: '13 يونيو 2026',
    hoursLeft: 38,
  },
  {
    id: 'KF-2701',
    title: 'نزاع محتوى تسويقي — Startup Brand',
    against: 'Noura H.',
    amount: 250,
    status: 'resolved_won',
    role: 'requester',
    filed: '5 يونيو 2026',
    hoursLeft: 0,
  },
  {
    id: 'KF-2655',
    title: 'نزاع تطوير موقع — Restaurant App',
    against: 'Omar T.',
    amount: 900,
    status: 'resolved_lost',
    role: 'respondent',
    filed: '22 مايو 2026',
    hoursLeft: 0,
  },
];

const statusConfig: Record<string, { label: string; icon: JSX.Element; bg: string; border: string; text: string }> = {
  open: {
    label: 'قيد التحكيم',
    icon: <Clock size={14} />,
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
  },
  resolved_won: {
    label: 'محسوم — فزت',
    icon: <CheckCircle size={14} />,
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
  },
  resolved_lost: {
    label: 'محسوم — خسرت',
    icon: <AlertTriangle size={14} />,
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
  },
};

export default function DisputesPage() {
  const [tab, setTab] = useState<'all' | 'open' | 'resolved'>('all');
  const user: User = JSON.parse(localStorage.getItem('user') || 'null') || { role: 'client', name: 'Guest', username: 'guest', id: '0' };

  const filtered = MY_DISPUTES.filter(d => {
    if (tab === 'open') return d.status === 'open';
    if (tab === 'resolved') return d.status !== 'open';
    return true;
  });

  const openCount = MY_DISPUTES.filter(d => d.status === 'open').length;
  const wonCount  = MY_DISPUTES.filter(d => d.status === 'resolved_won').length;
  const lostCount = MY_DISPUTES.filter(d => d.status === 'resolved_lost').length;

  return (
    <div className="animate-fade-in max-w-4xl mx-auto space-y-8" dir="rtl">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">مركز النزاعات</h1>
          <p className="text-gray-500 font-medium">تتبع جميع نزاعاتك التحكيمية في مكان واحد.</p>
        </div>
        {user.role === 'arbitrator' && (
          <Link
            to="/dashboard/arbitrator"
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5"
            style={{ background: '#0D1B2A' }}
          >
            <Scale size={16} /> لوحة التحكيم <ChevronLeft size={14} />
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1">
            <Clock size={12} /> مفتوحة
          </p>
          <p className="text-3xl font-black text-[#0D1B2A]">{openCount}</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1">
            <CheckCircle size={12} /> فزت
          </p>
          <p className="text-3xl font-black text-emerald-700">{wonCount}</p>
        </div>
        <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-red-500 uppercase mb-2 flex items-center gap-1">
            <AlertTriangle size={12} /> خسرت
          </p>
          <p className="text-3xl font-black text-red-600">{lostCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-[#E8DDD0] p-1 rounded-2xl w-fit">
        {([['all', 'الكل'], ['open', 'مفتوحة'], ['resolved', 'محسومة']] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${tab === key ? 'text-[#0D1B2A] shadow font-black' : 'text-gray-400 hover:text-gray-600'}`}
            style={tab === key ? { background: '#C9A84C', color: '#0D1B2A' } : {}}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Dispute Cards */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-[#E8DDD0] rounded-3xl bg-white">
            <Gavel size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 font-bold">لا توجد نزاعات في هذه الفئة.</p>
          </div>
        )}

        {filtered.map(d => {
          const sc = statusConfig[d.status];
          const pct = d.hoursLeft > 0 ? ((48 - d.hoursLeft) / 48) * 100 : 100;

          return (
            <div key={d.id}
              className={`bg-white border-2 rounded-3xl p-6 transition-all hover:shadow-lg ${d.status === 'open' ? 'border-[#E8DDD0] hover:border-[#C9A84C]/30' : sc.border}`}
            >
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">⚖️ {d.id}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full border ${sc.bg} ${sc.border} ${sc.text}`}>
                      {sc.icon} {sc.label}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
                      {d.role === 'requester' ? 'أنت المشتكي' : 'أنت المدعى عليه'}
                    </span>
                  </div>

                  <h3 className="font-black text-lg text-[#0D1B2A] mb-1">{d.title}</h3>
                  <p className="text-sm text-gray-400 mb-3">ضد: <span className="font-bold text-gray-600">{d.against}</span> · تاريخ الفتح: {d.filed}</p>

                  {d.status === 'open' && (
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-gray-400 mb-1">
                        <span className="flex items-center gap-1"><Clock size={10} /> متبقي {d.hoursLeft} ساعة من 48</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${d.hoursLeft <= 12 ? 'bg-red-400' : 'bg-[#C9A84C]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {d.status === 'resolved_won' && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black">
                        ✅ تم استرداد {d.amount}$ بالكامل
                      </div>
                    </div>
                  )}

                  {d.status === 'resolved_lost' && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded-full text-xs font-black">
                        ❌ الحكم لصالح الطرف الآخر
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:min-w-[140px]">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase">المبلغ المتنازع</p>
                    <p className="text-2xl font-black text-[#0D1B2A]">${d.amount}</p>
                  </div>

                  {d.status === 'open' && (
                    <Link
                      to={`/arbitrate/${d.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 whitespace-nowrap"
                      style={{ background: '#0D1B2A' }}
                    >
                      <FileText size={14} /> تتبع القضية
                    </Link>
                  )}

                  {d.status !== 'open' && (
                    <Link
                      to={`/arbitrate/${d.id}`}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border border-[#E8DDD0] text-gray-500 hover:bg-gray-50 transition-all whitespace-nowrap"
                    >
                      <FileText size={14} /> عرض التفاصيل
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
