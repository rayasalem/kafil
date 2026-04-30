import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  LayoutDashboard, 
  ArrowRight, 
  ChevronLeft, 
  Lock, 
  TrendingUp, 
  Search,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { api } from '@/services/api';
import { Project, User } from '@/types';
import { formatCurrency } from '@/shared/utils/format';

// Mock AI Suggestions
const AI_BREAKDOWN_SUGGESTIONS = [
  { role: 'مصمم واجهات', hours: 40, rate: 15, total: 600, fairness: 'above' },
  { role: 'مطور واجهات', hours: 80, rate: 20, total: 1600, fairness: 'market' },
  { role: 'كاتب محتوى', hours: 10, rate: 12, total: 120, fairness: 'below' },
];

export default function CoordinatorDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const user: User = JSON.parse(localStorage.getItem('user') || 'null') || {
    role: 'coordinator', name: 'Tariq M.', username: 'tariq_m', id: '3'
  };

  useEffect(() => {
    api.getProjects().then(data => setProjects(data));
  }, []);

  const handleGenerate = () => {
    if (!prompt) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowBreakdown(true);
    }, 1500);
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto space-y-10" dir="rtl">
      
      {/* Header & Reputation Badge */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-[#0D1B2A] tracking-tight mb-2">لوحة المنسق (Lead)</h1>
          <p className="text-gray-500 font-medium">أهلاً طارق! أنت الآن تدير 3 فرق عمل بنجاح.</p>
        </div>
        <div className="bg-white border-2 border-[#C9A84C] p-4 rounded-2xl flex items-center gap-4 shadow-lg shadow-[#C9A84C]/10">
          <div className="bg-[#C9A84C] p-3 rounded-xl text-white">
            <ShieldCheck size={28} />
          </div>
          <div>
            <p className="text-[10px] font-black text-[#C9A84C] uppercase tracking-widest">Kafil Verified Lead</p>
            <p className="text-lg font-black text-[#0D1B2A]">⭐ 4.9 <span className="text-sm font-bold text-gray-400 mr-2">| 24 مشروع</span></p>
          </div>
        </div>
      </div>

      {/* AI Breakdown Tool Section */}
      <section className="bg-[#0D1B2A] rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#C9A84C] rounded-full blur-[120px] opacity-10 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-[#C9A84C] p-2 rounded-lg text-[#0D1B2A]">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <h2 className="text-xl font-bold">مساعد كفيل الذكي لتوزيع الميزانية</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <p className="text-blue-100/70 mb-4 text-sm">صف مشروعك بكلماتك الخاصة، وسيقوم الذكاء الاصطناعي باقتراح الأدوار والميزانية العادلة لكل مستقل.</p>
              <div className="relative group">
                <textarea 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="مثال: بناء تطبيق متجر إلكتروني بسيط مع 5 شاشات وبوابة دفع..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white placeholder-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-all min-h-[120px]"
                />
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="absolute bottom-4 left-4 bg-[#C9A84C] text-[#0D1B2A] px-6 py-3 rounded-xl font-black text-sm hover:bg-[#D4B55E] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isGenerating ? 'جاري التحليل...' : 'توليد التقسيم المقترح'}
                </button>
              </div>
            </div>

            <div className="min-h-[200px]">
              {!showBreakdown && !isGenerating && (
                <div className="h-full border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center text-white/20 p-10 text-center">
                  <Search size={48} className="mb-4 opacity-50" />
                  <p className="font-bold">أدخل وصف المشروع للبدء</p>
                </div>
              )}

              {isGenerating && (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-white/5 animate-pulse rounded-xl"></div>
                  ))}
                </div>
              )}

              {showBreakdown && (
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4 animate-fade-up">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-2">
                    <span className="text-xs font-bold text-gray-400">الدور المقترح</span>
                    <span className="text-xs font-bold text-gray-400">الميزانية التقديرية</span>
                  </div>
                  {AI_BREAKDOWN_SUGGESTIONS.map((item, i) => (
                    <div key={i} className="flex justify-between items-center group">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/50">{i+1}</div>
                        <div>
                          <p className="text-sm font-bold">{item.role}</p>
                          <p className="text-[10px] text-white/40">{item.hours} ساعة · ${item.rate}/ساعة</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-black text-[#C9A84C]">${item.total}</p>
                        <span className={`text-[9px] font-bold px-1.5 rounded uppercase ${
                          item.fairness === 'above' ? 'text-emerald-400 bg-emerald-400/10' : 
                          item.fairness === 'market' ? 'text-blue-400 bg-blue-400/10' : 'text-amber-400 bg-amber-400/10'
                        }`}>
                          {item.fairness === 'above' ? 'أعلى من السوق' : item.fairness === 'market' ? 'سعر السوق' : 'أقل من السوق'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <button className="w-full bg-white text-[#0D1B2A] py-3 rounded-xl font-black text-xs hover:bg-gray-100 transition-colors mt-4">
                    اعتماد هذا التقسيم للمشروع
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Stats Row */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><LayoutDashboard size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">مشاريع نشطة</p>
            <p className="text-2xl font-black text-[#0D1B2A]">{projects.length}</p>
          </div>
        </div>
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl"><Users size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">إجمالي المستقلين</p>
            <p className="text-2xl font-black text-[#0D1B2A]">12</p>
          </div>
        </div>
        <div className="bg-white border border-[#E8DDD0] p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl"><TrendingUp size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase">أرباح المنسق (Lead Fee)</p>
            <p className="text-2xl font-black text-[#0D1B2A]">$850</p>
          </div>
        </div>
        <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 p-5 rounded-2xl flex items-center gap-4">
          <div className="bg-[#C9A84C] text-white p-3 rounded-xl"><AlertCircle size={24}/></div>
          <div>
            <p className="text-[10px] font-black text-[#C9A84C] uppercase">تنبيهات العدالة</p>
            <p className="text-2xl font-black text-[#0D1B2A]">1</p>
          </div>
        </div>
      </div>

      {/* Active Projects Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h2 className="text-xl font-bold text-[#0D1B2A]">إدارة الفرق والمشاريع</h2>
          <Link to="/create" className="text-[#C9A84C] text-sm font-bold flex items-center gap-1 hover:underline">إضافة مشروع جديد <ChevronLeft size={16}/></Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {projects.map(p => (
            <Link key={p.id} to={`/projects/${p.id}`} className="bg-white border border-[#E8DDD0] p-7 rounded-[32px] hover:border-[#C9A84C]/40 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-black text-xl text-[#0D1B2A] mb-1 group-hover:text-[#C9A84C] transition-colors">{p.title}</h3>
                  <p className="text-xs text-gray-400 font-bold">العميل: {p.owner}</p>
                </div>
                <div className="bg-gray-50 px-3 py-1.5 rounded-full text-[10px] font-black text-gray-500 border border-gray-100 flex items-center gap-1.5">
                  <Lock size={12}/> كفيل يحمي $3,200
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">حالة الفريق</p>
                  <div className="flex -space-x-2 space-x-reverse overflow-hidden mb-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 border border-gray-300 flex items-center justify-center text-[10px] font-bold text-gray-500">M{i}</div>
                    ))}
                  </div>
                  <p className="text-xs font-bold text-emerald-600">3 مقبولين · 1 معلق</p>
                </div>
                <div className="bg-[#0D1B2A] p-4 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Lead Fee (12%)</p>
                  <p className="text-xl font-black text-white">$384.00</p>
                  <p className="text-[10px] text-blue-200/50">يصرف عند اكتمال المشروع</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                   <span>توزيع المهام</span>
                   <span>65% مكتمل</span>
                 </div>
                 <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                    <div className="bg-[#C9A84C] h-full transition-all duration-1000 w-2/3"></div>
                 </div>
              </div>

              <div className="flex justify-between items-center pt-5 border-t border-gray-50">
                <div className="flex items-center gap-2 text-[#0D1B2A] text-sm font-bold">
                  <MessageSquare size={16} className="text-[#C9A84C]" />
                  <span>5 رسائل جديدة من الفريق</span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#C9A84C] group-hover:text-white transition-all">
                  <ArrowRight size={20} className="rotate-180" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
