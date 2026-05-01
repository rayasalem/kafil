import { FC } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';

const NotFound: FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/10 border border-red-100">
        <ShieldAlert size={48} />
      </div>
      <h1 className="text-8xl font-black text-gray-900 mb-4 tracking-tighter">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">هذه الصفحة غير موجودة في سجلاتنا</h2>
      <p className="text-gray-500 text-lg mb-10 max-w-md">يبدو أنك حاولت الوصول لصفحة لا تملك صلاحيتها أو أنها لم تُنشأ بعد في نظام كفيل.</p>
      
      <Link to="/" className="bg-blue-900 text-white font-black px-10 py-5 rounded-2xl hover:bg-blue-800 transition-all shadow-2xl shadow-blue-900/20 flex items-center gap-3 text-lg">
        <Home size={22}/> العودة للرئيسية
      </Link>
    </div>
  );
};

export default NotFound;
