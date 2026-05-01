import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Gavel, Clock, CheckCircle, Star, Shield, ChevronLeft, AlertCircle, TrendingUp, Award } from 'lucide-react';

const OPEN_CASES = [
  {
    id: 'KF-2847',
    title: 'نزاع تصميم واجهات — مشروع E-commerce',
    category: 'UI/UX Design',
    requester: 'Layla M.',
    respondent: 'Sara A.',
    amount: 600,
    hoursLeft: 38,
    totalHours: 48,
    severity: 'medium',
    aiSummaryReady: true,
  },
  {
    id: 'KF-2901',
    title: 'نزاع تطوير خلفي — مشروع SaaS',
    category: 'Backend Development',
    requester: 'Ahmed K.',
    respondent: 'Omar T.',
    amount: 1200,
    hoursLeft: 11,
    totalHours: 48,
    severity: 'high',
    aiSummaryReady: true,
  },
];

const PAST_CASES = [
  { id: 'KF-2801', title: 'نزاع كتابة محتوى', outcome: 'حكم لصالح المشتكي', reward: 3, date: '28 أبريل 2026', correct: true },
  { id: 'KF-2755', title: 'نزاع تسليم تطبيق موبايل', outcome: 'حكم جزئي 60/40', reward: 3, date: '20 أبريل 2026', correct: true },
  { id: 'KF-2702', title: 'نزاع تأخر تسليم', outcome: 'حكم لصالح المدعى عليه', reward: 3, date: '10 أبريل 2026', correct: false },
];

const CLIENT_DISPUTE_STATS = {
  totalDisputed: 2450,
  wonBack: 1850,
  lost: 600,
  activeCases: 1,
};

export default function ArbitratorDashboard() {
  const [tab, setTab] = useState<'open' | 'past'>('open');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : { role: 'guest', name: 'Guest' };

  const totalEarned = PAST_CASES.reduce((s, c) => s + c.reward, 0);

  return (
    <div className="animate-fade-in max-w-5xl mx-auto space-y-8" dir="rtl">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-1">
            {user.role === 'client' ? 'إحصائيات النزاعات' : 'مركز التحكيم المجتمعي'}
          </h1>
          <p className="text-gray-500 font-medium">
            {user.role === 'client' 
              ? 'تتبع النزاعات الخاصة بك والمبالغ المستردة من الضمان.' 
              : 'أنت محكّم موثق. قراراتك تصنع العدل لمستقلي المنطقة العربية وتحصل على مكافآت.'}
          </p>
        </div>
        
        {user.role !== 'client' && (
          <div className="flex items-center gap-3 bg-[#0D1B2A] px-5 py-3 rounded-2xl">
            <Shield size={20} className="text-[#C9A84C]" />
            <div>
              <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">محكّم موثق</p>
              <p className="text-sm font-black text-white">⭐ 4.8 · 47 قضية</p>
            </div>
          </div>
        )}
      </div>

      {user.role === 'client' ? (
        /* Client View */
        <div className="space-y-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Gavel size={12} /> نزاعات نشطة</p>
              <p className="text-3xl font-black text-[#0D1B2A]">{CLIENT_DISPUTE_STATS.activeCases}</p>
            </div>
            <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><AlertCircle size={12} /> إجمالي المتنازع عليه</p>
              <p className="text-3xl font-black text-[#0D1B2A]">${CLIENT_DISPUTE_STATS.totalDisputed}</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1"><CheckCircle size={12} /> مبالغ مستردة (فوز)</p>
              <p className="text-3xl font-black text-emerald-700">${CLIENT_DISPUTE_STATS.wonBack}</p>
            </div>
            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
              <p className="text-[10px] font-black text-red-500 uppercase mb-2 flex items-center gap-1"><TrendingUp size={12} /> مبالغ خاسرة</p>
              <p className="text-3xl font-black text-red-600">${CLIENT_DISPUTE_STATS.lost}</p>
            </div>
          </div>

          <div className="bg-white border-2 border-[#E8DDD0] rounded-3xl p-8 text-center shadow-sm">
            <h3 className="font-black text-[#0D1B2A] text-xl mb-3">تفاصيل قضاياك</h3>
            <p className="text-gray-500 font-medium mb-6">يمكنك متابعة تفاصيل النزاعات الخاصة بك وقراءة ملخصاتها من خلال مركز النزاعات الخاص بك.</p>
            <Link to="/disputes" className="inline-flex items-center gap-2 bg-[#0D1B2A] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all">
              <Gavel size={18} /> الانتقال إلى نزاعاتي
            </Link>
          </div>
        </div>
      ) : (
        /* Arbitrator (Freelancer/Coordinator) View */
        <>
          {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Gavel size={12} /> قضايا مفتوحة</p>
          <p className="text-3xl font-black text-[#0D1B2A]">{OPEN_CASES.length}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-amber-600 uppercase mb-2 flex items-center gap-1"><Clock size={12} /> أقرب موعد</p>
          <p className="text-3xl font-black text-amber-700">11س</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
          <p className="text-[10px] font-black text-emerald-600 uppercase mb-2 flex items-center gap-1"><TrendingUp size={12} /> مكاسبي (هذا الشهر)</p>
          <p className="text-3xl font-black text-emerald-700">${totalEarned}</p>
        </div>
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl">
          <p className="text-[10px] font-black text-gray-400 uppercase mb-2 flex items-center gap-1"><Award size={12} /> دقة القرارات</p>
          <p className="text-3xl font-black text-[#0D1B2A]">94%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white border border-[#E8DDD0] p-1 rounded-2xl w-fit">
        <button
          onClick={() => setTab('open')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'open' ? 'bg-[#0D1B2A] text-white shadow' : 'text-gray-500 hover:text-[#0D1B2A]'}`}
        >
          قضايا مفتوحة ({OPEN_CASES.length})
        </button>
        <button
          onClick={() => setTab('past')}
          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${tab === 'past' ? 'bg-[#0D1B2A] text-white shadow' : 'text-gray-500 hover:text-[#0D1B2A]'}`}
        >
          القضايا السابقة ({PAST_CASES.length})
        </button>
      </div>

      {/* Open Cases */}
      {tab === 'open' && (
        <div className="space-y-4">
          {OPEN_CASES.map(c => {
            const pct = ((c.totalHours - c.hoursLeft) / c.totalHours) * 100;
            const urgent = c.hoursLeft <= 12;
            return (
              <div key={c.id} className={`bg-white border-2 rounded-3xl p-6 transition-all hover:shadow-lg ${urgent ? 'border-red-200' : 'border-[#E8DDD0] hover:border-[#C9A84C]/40'}`}>
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-gray-400 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg">⚖️ {c.id}</span>
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full ${urgent ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>
                        {c.category}
                      </span>
                    </div>
                    <h3 className="font-black text-lg text-[#0D1B2A] mb-3">{c.title}</h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المشتكي</p>
                        <p className="text-sm font-bold text-[#0D1B2A]">{c.requester}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-xl">
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-1">المدعى عليه</p>
                        <p className="text-sm font-bold text-[#0D1B2A]">{c.respondent}</p>
                      </div>
                    </div>

                    {/* Timer Bar */}
                    <div>
                      <div className="flex justify-between text-[10px] font-black mb-1">
                        <span className={urgent ? 'text-red-500 flex items-center gap-1' : 'text-gray-400'}>
                          {urgent && <AlertCircle size={10} />} متبقي {c.hoursLeft} ساعة
                        </span>
                        <span className="text-gray-400">من أصل {c.totalHours} ساعة</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${urgent ? 'bg-red-500' : 'bg-[#C9A84C]'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center gap-4 md:min-w-[160px]">
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase">المبلغ المتنازع عليه</p>
                      <p className="text-2xl font-black text-[#0D1B2A]">${c.amount}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">مكافأتك: $3.00</p>
                    </div>
                    <Link
                      to={`/arbitrate/${c.id}`}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl font-black text-sm text-white transition-all hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
                      style={{ background: '#0D1B2A', boxShadow: '0 2px 12px rgba(13,27,42,0.2)' }}
                    >
                      <Gavel size={16} /> مراجعة القضية <ChevronLeft size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

          {/* Past Cases */}
          {tab === 'past' && (
            <div className="space-y-3">
              {PAST_CASES.map(c => (
                <div key={c.id} className="bg-white border border-[#E8DDD0] p-5 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                      {c.correct ? <CheckCircle size={20} /> : <Star size={20} />}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#0D1B2A]">{c.title}</p>
                      <p className="text-xs text-gray-400">{c.id} · {c.date}</p>
                      <p className="text-xs font-bold text-gray-500 mt-0.5">{c.outcome}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-black text-emerald-600">+${c.reward}</p>
                    <p className="text-[10px] text-gray-400">مكافأة</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
