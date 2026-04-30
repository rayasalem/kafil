import { useState } from 'react';
import { ShieldCheck, ArrowLeft, AlertTriangle, Lock, Briefcase, Zap, CheckCircle, BrainCircuit, Scale, ChevronDown, HeartHandshake, UserCheck, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "ما هو نظام الضمان المالي (Escrow)؟", a: "في كفيل، يقوم العميل بإيداع ميزانية المشروع كاملة لدينا في البداية. نحتفظ بها بشكل آمن، ولا نفرج عنها للمستقل إلا بعد إنجاز المهام المتفق عليها. هذا يضمن حق العميل في الاستلام وحق المستقل بالدفع." },
    { q: "ماذا لو حصل خلاف بيني وبين العميل؟", a: "نظام كفيل يحتوي على آلية لحل النزاعات. الذكاء الاصطناعي يقوم بتحليل سجل المحادثات وتحديد نسبة الإنجاز والتقصير، وتقديم مقترح عادل لتقسيم الميزانية لضمان حقوق الطرفين." },
    { q: "كيف يعمل مقيم العدالة (كاشف العدالة)؟", a: "أثناء تسعير المهام، يقوم نظام الذكاء الاصطناعي الخاص بنا بمقارنة المبالغ المعروضة مع متوسط أجور السوق الإقليمية للمستقلين. إذا كان المبلغ مجحفاً، يظهر تحذير للمدير وللمستقل قبل قبول العمل لضمان الإنصاف." },
    { q: "هل هناك رسوم إضافية لاستخدام العقد الذكي/الضمان؟", a: "يتم خصم نسبة بسيطة فقط عند نجاح المهمة واستلام المستقل لمستحقاته كرسوم لتشغيل النظام الآمن وتغطية تكاليف بوابات الدفع، دون أي رسوم مخفية." }
  ];

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans selection:bg-blue-200">
      
      {/* 🟢 NAVBAR */}
      <nav className="fixed w-full flex justify-between items-center p-5 md:px-10 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="text-2xl font-extrabold text-blue-900 flex items-center gap-2 tracking-tight">
          <ShieldCheck className="text-green-500" size={34}/> كفيل
        </div>
        <div className="hidden md:flex gap-8 text-gray-600 font-bold text-sm">
          <a href="#" className="hover:text-blue-600 transition">الرئيسية</a>
          <a href="#about" className="hover:text-blue-600 transition">من نحن</a>
          <a href="#how-it-works" className="hover:text-blue-600 transition">كيفية العمل</a>
          <a href="#ai-justice" className="hover:text-blue-600 transition">الذكاء الاصطناعي</a>
          <a href="#faq" className="hover:text-blue-600 transition">الأسئلة الشائعة</a>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="text-blue-900 font-bold px-4 py-2.5 hover:bg-blue-50 rounded-full transition">دخول</Link>
          <Link to="/register" className="bg-blue-900 text-white font-bold px-6 py-2.5 rounded-full hover:bg-blue-800 transition shadow-md shadow-blue-900/10">إنشاء حساب</Link>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <section className="pt-40 pb-20 px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-indigo-50 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-green-50/60 to-blue-50/50 rounded-full blur-[80px] -z-10"></div>
        
        <div className="inline-flex items-center gap-2 bg-white/80 text-blue-800 font-bold px-5 py-2.5 rounded-full text-sm mb-8 border border-blue-100 shadow-sm backdrop-blur-sm">
          <ShieldCheck size={18} className="text-blue-600" /> كفيل يحمي الدفعات حتى إتمام العمل بنجاح
        </div>
        
        <h1 className="text-5xl md:text-[5.5rem] font-black text-gray-900 mb-8 leading-[1.1] tracking-tight">
          احمِ أموالك. وخلي كل<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-blue-600 via-indigo-700 to-blue-900">واحد ياخذ حقه.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          منصة الضمان المالي الأولى التي تحفظ ميزانية المشاريع بأمان، وتضمن تسليم العمل المتقن للمستقل. بيئة آمنة للعملاء والمستقلين.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16">
          <Link to="/register" className="w-full sm:w-auto bg-blue-900 text-white font-bold px-10 py-4 rounded-2xl hover:bg-blue-800 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/20 text-lg group">
            ابدأ الآن <ArrowLeft size={22} className="transform group-hover:-translate-x-1 transition-transform"/>
          </Link>
          <a href="#how-it-works" className="w-full sm:w-auto bg-white text-gray-700 font-bold px-10 py-4 rounded-2xl hover:bg-gray-50 transition-all border-2 border-gray-100 text-lg flex items-center justify-center shadow-sm">
            كيف يعمل النظام
          </a>
        </div>

        {/* TRUST INDICATORS */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12 text-sm md:text-base font-bold text-gray-500 mb-20">
           <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full"><Lock size={18} className="text-green-500"/> أموالك محفوظة</div>
           <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full"><Scale size={18} className="text-blue-500"/> تحكيم عادل</div>
           <div className="flex items-center gap-2 bg-gray-50/80 px-4 py-2 rounded-full"><ShieldCheck size={18} className="text-indigo-500"/> دفع آمن</div>
        </div>

        {/* ESCROW VISUAL FLOW */}
        <div className="relative mt-4 max-w-4xl mx-auto z-10 px-4">
          <div className="absolute top-1/2 left-4 right-4 h-1.5 bg-gradient-to-r from-gray-100 via-blue-200 to-gray-100 -z-10 rounded-full hidden md:block transform -translate-y-1/2"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            
            {/* Client Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center relative group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 rounded-tr-[2rem] transition-colors group-hover:bg-blue-100"></div>
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><Briefcase size={36}/></div>
              <h3 className="font-bold text-2xl text-gray-900 mb-2">العميل</h3>
              <p className="text-base text-gray-500 font-medium">يودع ميزانية المشروع</p>
            </div>

            {/* Escrow/Kafeel Card */}
            <div className="bg-gradient-to-br from-blue-900 to-indigo-900 p-8 rounded-[2rem] shadow-2xl shadow-blue-900/30 border border-blue-700/50 flex flex-col items-center relative transform md:scale-110 z-10 group">
              <div className="absolute -top-4 -right-4">
                 <span className="flex h-8 w-8 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-8 w-8 bg-green-500 items-center justify-center text-white"><CheckCircle size={18} strokeWidth={3}/></span>
                </span>
              </div>
              <div className="w-20 h-20 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md shadow-inner border border-white/10"><Lock size={36}/></div>
              <h3 className="font-black text-2xl text-white mb-2 tracking-wide">خزنة كفيل</h3>
              <p className="text-sm text-blue-200 font-medium text-center leading-relaxed">المبلغ محجوز بأمان كامل في حسابات بنكية حتى التسليم</p>
            </div>

            {/* Freelancer Card */}
            <div className="bg-white p-8 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col items-center relative group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute top-0 left-0 w-24 h-24 bg-green-50 rounded-br-full -z-10 rounded-tl-[2rem] transition-colors group-hover:bg-green-100"></div>
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm"><UserCheck size={36}/></div>
              <h3 className="font-bold text-2xl text-gray-900 mb-2">المستقل</h3>
              <p className="text-base text-gray-500 font-medium">ينجز العمل ويستلم حقوقه</p>
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 ABOUT SECTION */}
      <section id="about" className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-6">عن كفيل</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              كفيل هو منصة تقنية مالية (Fintech) مبتكرة تهدف إلى القضاء على انعدام الثقة في سوق العمل المستقل. 
              نحن نعمل كطرف ثالث موثوق لتأمين الدفعات بطريقة تضمن الجودة للعملاء، والاستقرار المالي للمستقلين.
            </p>
        </div>
      </section>

      {/* 📊 TRUST METRICS */}
      <section className="py-10 border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100">
          <div className="pt-4 md:pt-0">
            <h4 className="text-4xl font-black text-blue-900 mb-2">+$2M</h4>
            <p className="text-gray-500 font-medium">أموال محمية بالضمان</p>
          </div>
          <div className="pt-4 md:pt-0">
             <h4 className="text-4xl font-black text-blue-900 mb-2">10k+</h4>
            <p className="text-gray-500 font-medium">مستقل استلم حقوقه في وقتها</p>
          </div>
          <div className="pt-4 md:pt-0">
             <h4 className="text-4xl font-black text-blue-900 mb-2">99.8%</h4>
            <p className="text-gray-500 font-medium">نسبة النزاعات المحلولة بذكاء</p>
          </div>
        </div>
      </section>

      {/* ❌ PROBLEM VS ✅ SOLUTION SECTION */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
             <h2 className="text-3xl md:text-4xl font-black text-gray-900">سوق العمل الحر يعاني من أزمة ثقة</h2>
             <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">في كل عام، يخسر المستقلون والشركات ملايين الدولارات بسبب الاحتيال، التأخر في السداد، أو الاستغلال المالي المتعمد من بعض الوسطاء.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 border border-red-100 p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-full bg-red-400"></div>
              <h3 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-2">
                <AlertTriangle className="text-red-500"/> الطريق التقليدي (خطر)
              </h3>
              <ul className="space-y-5 text-red-800">
                <li className="flex items-start gap-3">
                  <div className="bg-red-200 rounded-full p-1 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
                  <span className="font-semibold text-lg">تحويل الأموال لمنسقين ووسطاء يخفون المبالغ الفعلية عن المستقل لزيادة هوامش ربحهم.</span>
                </li>
                 <li className="flex items-start gap-3">
                  <div className="bg-red-200 rounded-full p-1 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
                  <span className="font-semibold text-lg">المستقل ينجز العمل والعميل يختفي، أو العميل يدفع مقدماً والمستقل يختفي.</span>
                </li>
                 <li className="flex items-start gap-3">
                  <div className="bg-red-200 rounded-full p-1 mt-0.5"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
                  <span className="font-semibold text-lg">نزاعات لا تنتهي بسبب انعدام العقود الواضحة وآليات فض الشراكات.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-100 p-8 rounded-3xl shadow-lg relative overflow-hidden transform md:-translate-y-4">
              <div className="absolute top-0 right-0 w-2 h-full bg-blue-600"></div>
              <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-blue-600"/> مسار كفيل (أمان وثقة)
              </h3>
              <ul className="space-y-5 text-blue-900">
                <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 shrink-0"/>
                  <span className="font-semibold text-lg">الأموال تودع مسبقاً وتُحجز في (خزنة كفيل) فلا يعمل المستقل إلا والمبلغ مؤمّن.</span>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 shrink-0"/>
                  <span className="font-semibold text-lg">شفافية تامة: المستقل يرى ميزانية المهمة ولا مجال لاقتطاع رسوم خفية من الوسيط.</span>
                </li>
                 <li className="flex items-start gap-3">
                  <CheckCircle className="text-blue-600 shrink-0"/>
                  <span className="font-semibold text-lg">الذكاء الاصطناعي يراقب الأرقام وينبه عند محاولة استغلال المستقلين بمبالغ أقل من السوق.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 💸 MONEY FLOW VISUALIZATION */}
      <section id="escrow" className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">كيف تتدفق الأموال؟ (محاكاة الضمان)</h2>
          <p className="text-gray-500 mb-16 text-lg">نحن لا نلمس أموالك للاستثمار، نحن نحرسها بكيانات بنكية مستقلة حتى إتمام مهامك.</p>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-4xl mx-auto relative">
             <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1.5 bg-gray-100 -z-10 rounded-full"></div>
             
             {/* Step 1: Client */}
             <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full md:w-64 z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4"><Briefcase size={32}/></div>
                <h4 className="font-bold text-lg">العميل</h4>
                <p className="text-sm text-gray-500 mt-2">يقوم المالك بإيداع ميزانية المشروع كاملة ليثبت جديته ويؤمن التزاماته.</p>
             </div>

             {/* Arrow/Line */}
             <div className="hidden md:flex text-gray-300"><ArrowLeft size={32}/></div>

             {/* Step 2: Escrow Vault */}
             <div className="bg-blue-900 text-white p-8 rounded-3xl shadow-xl border border-blue-800 w-full md:w-72 z-10 flex flex-col items-center transform scale-105">
                <div className="w-20 h-20 bg-blue-800/50 text-green-400 rounded-full flex items-center justify-center mb-4 ring-4 ring-blue-700"><Lock size={40}/></div>
                <h4 className="font-black text-2xl">خزنة كفيل (Escrow)</h4>
                <p className="text-sm text-blue-200 mt-2">الأموال مجمدة هنا. العميل لا يستطيع سحبها والمستقل لا يملكها حتى التسليم.</p>
             </div>

             {/* Arrow/Line */}
             <div className="hidden md:flex text-gray-300"><ArrowLeft size={32}/></div>

             {/* Step 3: Freelancers */}
             <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 w-full md:w-64 z-10 flex flex-col items-center">
                <div className="flex gap-2 mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><UserCheck size={24}/></div>
                  <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><UserCheck size={24}/></div>
                </div>
                <h4 className="font-bold text-lg">المستقلون</h4>
                <p className="text-sm text-gray-500 mt-2">بمجرد الاعتماد، يتم توجيه الدفعات مباشرة إلى حساباتهم البنكية.</p>
             </div>
          </div>
        </div>
      </section>

      {/* 🤖 AI FEATURES */}
      <section id="ai-justice" className="py-24 bg-gray-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9Im5vbmUiLz4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+Cjwvc3ZnPg==')] opacity-50 pointer-events-none"></div>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center z-10 relative">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 font-bold px-4 py-2 rounded-full text-sm mb-6 border border-blue-500/30">
              <Zap size={16} /> مدعوم بمحركات GPT-4o
            </div>
            <h2 className="text-4xl font-black mb-6">الذكاء الاصطناعي كضامن للعدالة</h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              تنفرد منصة كفيل بدمج الذكاء الاصطناعي لضمان النزاهة في تسعير المشاريع. نقوم بتحليل المهام وتنبيه الأطراف إذا كان التسعير مبالغاً فيه أو مجحفاً، كما نلخص النزاعات بسرعة فائقة في حال الاختلاف.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="mt-1 bg-blue-800 p-2 rounded-lg text-blue-300"><Scale size={24}/></div>
                <div>
                  <h4 className="font-bold text-xl mb-1">كاشف العدالة المالي</h4>
                  <p className="text-gray-400">يقارن تسعير المهمة بأسعار السوق. إذا أعطى الوسيط للمستقل $100 لمهمة برمجية متوسطها $500، يتدخل النظام ليطالب برفع التعويض.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="mt-1 bg-blue-800 p-2 rounded-lg text-blue-300"><BrainCircuit size={24}/></div>
                <div>
                  <h4 className="font-bold text-xl mb-1">التقسيم التلقائي للميزانيات</h4>
                  <p className="text-gray-400">يقرأ وصف المشروع المقدم، ويقترح تقسيماً عادلاً لمهام فرعية وتوجيه الميزانية بنسب معقولة كمسودة أولية للمالك.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-blue-600 rounded-3xl filter blur-3xl opacity-30"></div>
            <div className="bg-gray-800 border border-gray-700 p-8 rounded-3xl shadow-2xl relative">
              <div className="flex border-b border-gray-700 pb-4 mb-4 gap-4 items-center">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <span className="text-gray-500 text-sm font-mono mr-auto">kafeel-justice-engine.ts</span>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">تحليل المهمة: برمجة الواجهات الأمامية</p>
                  <p className="text-white font-bold text-lg mb-2">المعروض: 150 دولار</p>
                  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg flex gap-2 text-sm">
                    <AlertTriangle size={18}/> <span>تحذير: هذا السعر أقل بـ 60% من متوسط السوق الإقليمية. يرجى توخي العدل.</span>
                  </div>
                </div>
                <div className="bg-gray-900 border border-gray-700 p-4 rounded-xl">
                  <p className="text-gray-400 text-sm mb-1">تحليل المهمة: تصميم الشعار (Logo)</p>
                  <p className="text-white font-bold text-lg mb-2">المعروض: 350 دولار</p>
                  <div className="bg-green-500/20 text-green-400 p-3 rounded-lg flex gap-2 text-sm">
                    <CheckCircle size={18}/> <span>تطابق جيد: السعر ضمن متوسط السوق والمهمة عادلة للطرفين.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-gray-900 mb-12">صمم للمستقلين وملاك الأعمال</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-right relative">
                <HeartHandshake className="text-blue-200 absolute top-6 left-6" size={40}/>
                <p className="text-gray-600 text-lg mb-6 relative z-10 lg:pl-10">"كنا نعاني من اختفاء بعض المستقلين بعد استلام الدفعة الأولى. مع خزنة الضمان بكفيل، صرنا ندفع بثقة واحنا متأكدين ان العمل سيتم."</p>
                <div>
                  <h5 className="font-bold text-gray-900">سالم القحطاني</h5>
                  <p className="text-gray-500 text-sm">مؤسس شركة ناشئة</p>
                </div>
              </div>
              <div className="bg-blue-900 text-white shadow-xl shadow-blue-900/10 p-8 rounded-3xl text-right relative transform scale-105">
                <p className="text-blue-100 text-lg mb-6 relative z-10 lg:pl-10">"لأول مرة أشوف نظام يمنع الوسيط من ابتلاع ميزانية العميل! في كفيل أعرف بالضبط القيمة المخصصة لمهمتي وبفضل الله لم يضع لي حق أبداً."</p>
                <div>
                  <h5 className="font-bold text-white">سارة طارق</h5>
                  <p className="text-blue-300 text-sm">مطور أنظمة خلفية (مستقلة)</p>
                </div>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-8 rounded-3xl text-right relative">
                 <HeartHandshake className="text-green-200 absolute top-6 left-6" size={40}/>
                <p className="text-gray-600 text-lg mb-6 relative z-10 lg:pl-10">"كنت متخوف من توظيف فريق كبير بسبب التعقيد المالي وكثرة الحوالات. كفيل حل لي كل مشاكلي وصرت أعتمد المهام بكبسة زر."</p>
                <div>
                  <h5 className="font-bold text-gray-900">محمد علي</h5>
                  <p className="text-gray-500 text-sm">مدير مشاريع تقنية</p>
                </div>
              </div>
            </div>
        </div>
      </section>

      {/* ❓ FAQ */}
      <section id="faq" className="py-24 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-gray-900 mb-4">الأسئلة الشائعة</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 text-right font-bold text-lg text-gray-800 flex justify-between items-center focus:outline-none"
                >
                  {faq.q}
                  <ChevronDown className={`transform transition-transform text-gray-400 ${openFaq === i ? "rotate-180" : ""}`}/>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-0 text-gray-600 text-lg leading-relaxed border-t border-gray-50 mt-2 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA */}
      <section className="py-24 px-6 md:px-10">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden max-w-6xl mx-auto shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400 opacity-10 rounded-full blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 relative z-10">عالم من الثقة. خالي من الاستغلال.</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto relative z-10">ابنِ فريقك عن بعد بثقة متناهية، أو احصل على حقوقك كمستقل في موعدها بلا أي تلاعب.</p>
          <Link to="/register" className="inline-block bg-white text-blue-900 font-extrabold px-12 py-5 rounded-2xl hover:bg-gray-100 transition shadow-xl text-lg relative z-10">
            ابدأ باستخدام كفيل مجاناً
          </Link>
        </div>
      </section>

      {/* 🏁 FOOTER */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8 px-6 text-center md:text-right">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="text-2xl font-black text-blue-900 flex items-center justify-center md:justify-start gap-2 mb-4">
              <ShieldCheck className="text-green-500" size={28}/> كفيل
            </div>
            <p className="text-gray-500 max-w-sm mx-auto md:mx-0">نظام لضمان المدفوعات والتحكيم المجتمعي، مصمم لرفع الثقة في سوق العمل الحر في العالم العربي.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">المنتج</h4>
            <ul className="space-y-2 text-gray-500">
              <li>الميزات</li>
              <li>الأسعار</li>
              <li>نظام الضمان</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">قانوني</h4>
            <ul className="space-y-2 text-gray-500">
              <li>الشروط والأحكام</li>
              <li>الخصوصية</li>
              <li>شروط التحكيم</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-100 max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} كفيل - Kafeel. جميع الحقوق محفوظة.</p>
          <p className="mt-2 md:mt-0">بُني بشغف في الهاكاثون 🚀</p>
        </div>
      </footer>
    </div>
  );
}

