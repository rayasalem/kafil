import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-900 mb-4">الصفحة غير موجودة</h2>
      <p className="text-gray-500 mb-8 max-w-md">عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.</p>
      <Link to="/" className="bg-blue-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-blue-700 transition">
        العودة للرئيسية
      </Link>
    </div>
  );
}
