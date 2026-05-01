import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, Gavel, ArrowRight, CheckCircle, AlertTriangle, Users, Banknote, RefreshCcw, HandCoins } from 'lucide-react';

export default function DisputeFlow() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  // State: 'idle' -> 'review' -> 'voting' -> 'verdict_eval' -> 'resolved_fair' | 'resolved_false'
  const [stage, setStage] = useState<string>('idle');
  const [complainant, setComplainant] = useState<'freelancer' | 'client'>('freelancer'); // 'freelancer' or 'client'
  const [mockSelected, setMockSelected] = useState<'fair' | 'false' | null>(null);

  // For visual demo purposes, let's hardcode some values
  const disputedAmount = 1500;
  const platformFeePercent = 5;

  const runSimulation = (scenario: 'fair' | 'false') => {
    setMockSelected(scenario);
    setStage('review');
    
    setTimeout(() => setStage('voting'), 2000);
    setTimeout(() => setStage('verdict_eval'), 4000);
    setTimeout(() => setStage(scenario === 'fair' ? 'resolved_fair' : 'resolved_false'), 6000);
  };

  const currentStep = () => {
    if (stage === 'idle') return 0;
    if (stage === 'review') return 1;
    if (stage === 'voting') return 2;
    if (stage === 'verdict_eval') return 3;
    return 4;
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-bold transition-colors"
      >
        <ArrowRight size={20} /> العودة للمشروع
      </button>

      <div className="bg-white border text-center border-gray-100 rounded-[2rem] p-8 mb-8 shadow-sm">
         <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
            <ShieldAlert size={32} />
         </div>
         <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">نظام المنازعات والتحكيم</h1>
         <div className="inline-flex items-center justify-center gap-2 bg-gradient-to-l from-green-50 to-emerald-50 text-emerald-800 font-bold px-6 py-3 rounded-full text-sm border border-emerald-100 shadow-sm">
           <HandCoins size={20} className="text-emerald-600" />
           لا يوجد رسوم فتح شكوى — الدفع حسب النتيجة فقط
         </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-[2rem] p-8 mb-8 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.1)]">
        {/* Timeline */}
        <div className="relative mb-16 px-4">
          <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gray-100 -z-10 rounded-full transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-4 h-1.5 bg-blue-600 -z-10 rounded-full transform -translate-y-1/2 transition-all duration-1000" style={{ width: `${(currentStep() / 4) * 100}%` }}></div>
          
          <div className="flex justify-between relative z-10 w-full">
            {[ 
              { icon: ShieldAlert, label: 'فتح الشكوى' },
              { icon: Gavel, label: 'المراجعة' },
              { icon: Users, label: 'تصويت المحكمين' },
              { icon: RefreshCcw, label: 'إصدار الحكم' },
              { icon: Banknote, label: 'إعادة توزيع الأموال' }
            ].map((step, idx) => {
              const active = currentStep() >= idx;
              const current = currentStep() === idx;
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg border-4 transition-all duration-500 ${active ? 'bg-blue-600 text-white border-blue-100 shadow-lg shadow-blue-600/30' : 'bg-gray-100 text-gray-400 border-white'}`}>
                    {current ? <Icon size={20} className="animate-pulse" /> : <Icon size={18} />}
                  </div>
                  <span className={`text-xs font-bold ${active ? 'text-blue-900' : 'text-gray-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* States content */}
        {stage === 'idle' && (
          <div className="text-center space-y-6 animate-fade-in py-10">
            <h3 className="text-2xl font-black text-gray-800">اختر نوع المحاكاة لاختبار النظام</h3>
            <p className="text-gray-500 font-medium max-w-lg mx-auto">نظام كفيل يعتمد على 3 مُحكّمين مستقلين. يتم خصم نسبة {platformFeePercent}% من الطرف الخاسر فقط بعد إصدار الحكم.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button onClick={() => runSimulation('fair')} className="bg-blue-600 text-white font-bold px-8 py-5 rounded-2xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 flex flex-col items-center gap-2">
                <span className="flex items-center gap-2"><CheckCircle size={20}/> محاكاة: المشتكي على حق</span>
                <span className="text-xs text-blue-200 font-normal">الطرف الآخر يتكفل برسوم المنصة وتُسترد الحقوق</span>
              </button>
              
              <button onClick={() => runSimulation('false')} className="bg-red-600 text-white font-bold px-8 py-5 rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex flex-col items-center gap-2">
                <span className="flex items-center gap-2"><AlertTriangle size={20}/> محاكاة: المشتكي على باطل</span>
                <span className="text-xs text-red-200 font-normal">تُفرض غرامة الادعاء الباطل ويُعوّض الطرف المتضرر</span>
              </button>
            </div>
          </div>
        )}

        {(stage === 'review' || stage === 'voting' || stage === 'verdict_eval') && (
          <div className="text-center py-16 animate-fade-in relative">
             <div className="w-24 h-24 border-4 border-gray-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-6"></div>
             <h3 className="text-2xl font-black text-blue-900 mb-2">
               {stage === 'review' && 'جاري مراجعة الأدلة من قبل 3 محكمين...'}
               {stage === 'voting' && 'المحكمين يقومون بالتصويت الآن...'}
               {stage === 'verdict_eval' && 'جاري حساب النتيجة وبناء هيكل التعويضات...'}
             </h3>
             <p className="text-gray-500 font-bold">الشفافية الكاملة: يمكنك متابعة سير العملية دون أي تكاليف مسبقة.</p>
          </div>
        )}

        {stage === 'resolved_fair' && (
          <div className="animate-fade-in bg-green-50 border border-green-200 rounded-[2rem] p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
             <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <CheckCircle size={40} />
             </div>
             <h3 className="text-3xl font-black text-green-900 mb-4">حكم عادل — المشتكي على حق</h3>
             <p className="text-green-800/80 font-bold mb-8 text-lg">تم إثبات مصداقية الشكوى بالأغلبية. تم خصم حقوق المنصة من الطرف الخاسر فقط.</p>
             
             <div className="grid md:grid-cols-3 gap-6 relative z-10 w-full max-w-2xl mx-auto">
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                   <p className="text-xs text-gray-400 font-bold mb-1">تعويض المشتكي</p>
                   <p className="text-2xl font-black text-green-600">${disputedAmount}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                   <p className="text-xs text-gray-400 font-bold mb-1">يخسر الطرف الآخر</p>
                   <p className="text-2xl font-black text-red-600">-${disputedAmount + (disputedAmount * platformFeePercent / 100)}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                   <p className="text-xs text-gray-400 font-bold mb-1">عمولة المنصة ({platformFeePercent}%)</p>
                   <p className="text-2xl font-black text-blue-600">${disputedAmount * platformFeePercent / 100}</p>
                </div>
             </div>
             
             <div className="mt-8 flex justify-center">
               <button onClick={() => setStage('idle')} className="text-green-700 hover:text-green-900 font-bold underline underline-offset-4">إعادة المحاكاة</button>
             </div>
          </div>
        )}

        {stage === 'resolved_false' && (
          <div className="animate-fade-in bg-red-50 border border-red-200 rounded-[2rem] p-8 text-center relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>
             <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <AlertTriangle size={40} />
             </div>
             <h3 className="text-3xl font-black text-red-900 mb-4">غرامة ادعاء باطل — المشتكي على خطأ</h3>
             <p className="text-red-800/80 font-bold mb-8 text-lg">لم تثبت صحة الشكوى. لتجنب استغلال النظام، يُغرم المشتكي لتغطية عمولة المنصة وإزعاج الطرف الآخر.</p>
             
             <div className="grid md:grid-cols-3 gap-6 relative z-10 w-full max-w-2xl mx-auto">
                <div className="bg-white p-5 rounded-2xl border border-red-100 shadow-sm text-center transform scale-105">
                   <p className="text-xs text-red-400 font-bold mb-1">غرامة على المشتكي</p>
                   <p className="text-2xl font-black text-red-600">-${disputedAmount * platformFeePercent / 100}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                   <p className="text-xs text-gray-400 font-bold mb-1">يستلم الطرف المتضرر</p>
                   <p className="text-2xl font-black text-green-600">${disputedAmount}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl shadow-sm text-center">
                   <p className="text-xs text-gray-400 font-bold mb-1">عمولة المنصة ({platformFeePercent}%)</p>
                   <p className="text-2xl font-black text-blue-600">${disputedAmount * platformFeePercent / 100}</p>
                </div>
             </div>

             <div className="mt-8 flex justify-center">
               <button onClick={() => setStage('idle')} className="text-red-700 hover:text-red-900 font-bold underline underline-offset-4">إعادة المحاكاة</button>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
