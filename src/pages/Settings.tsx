import { FC } from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, User, Clock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const SettingsPage: FC = () => {
  const sections = [
    { title: 'الحساب الشخصي', icon: <User />, desc: 'تعديل بياناتك الشخصية والصورة الرمزية' },
    { title: 'الأمان والحماية', icon: <Shield />, desc: 'تغيير كلمة المرور وإعدادات التحقق' },
    { title: 'التنبيهات', icon: <Bell />, desc: 'إدارة الإشعارات والرسائل البريدية' },
    { title: 'المحفظة والفوترة', icon: <CreditCard />, desc: 'إدارة بوابات الدفع وسجل العمليات' },
    { title: 'الجلسات النشطة', icon: <Clock />, desc: 'متابعة الأجهزة التي تستخدم حسابك' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-10 px-6"
      dir="rtl"
    >
      <div className="mb-10">
        <h1 className="text-3xl font-black text-[#0D1B2A] mb-2 flex items-center gap-3">
          <Settings size={32} className="text-[#C9A84C]" /> إعدادات المنصة
        </h1>
        <p className="text-gray-500 font-medium">تحكم في تفضيلات حسابك وإعدادات الخصوصية والأمان.</p>
      </div>

      <div className="grid gap-4">
        {sections.map((section, idx) => (
          <button 
            key={idx}
            onClick={() => toast.info(`ميزة ${section.title} سيتم تفعيلها في الإصدار القادم`)}
            className="flex items-center justify-between p-6 bg-white border border-[#E8DDD0] rounded-3xl hover:border-[#C9A84C]/40 hover:shadow-lg transition-all group text-right"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-gray-50 text-[#0D1B2A] flex items-center justify-center group-hover:bg-[#C9A84C]/10 group-hover:text-[#C9A84C] transition-colors">
                {section.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0D1B2A]">{section.title}</h3>
                <p className="text-sm text-gray-400 font-medium">{section.desc}</p>
              </div>
            </div>
            <div className="text-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity">
              تعديل —
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default SettingsPage;
