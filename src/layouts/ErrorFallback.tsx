import { FC } from 'react';

export const GlobalErrorFallback: FC<{ error: Error; resetErrorBoundary: () => void }> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center" dir="rtl">
      <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">عذراً، حدث خطأ غير متوقع</h2>
      <p className="text-gray-500 mb-8 max-w-md">نحن نأسف لهذا الخطأ. خزنتك المالية لا تزال آمنة، يرجى المحاولة مرة أخرى.</p>
      <div className="flex gap-4">
        <button 
          onClick={resetErrorBoundary}
          className="bg-blue-900 text-white font-bold px-8 py-3 rounded-2xl hover:bg-blue-800 transition-all"
        >
          إعادة المحاولة
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-2xl hover:bg-gray-200 transition-all"
        >
          العودة للرئيسية
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <pre className="mt-10 p-4 bg-gray-50 rounded-xl text-xs text-red-500 text-left overflow-auto max-w-full" dir="ltr">
          {error.message}
        </pre>
      )}
    </div>
  );
};
