import { FC } from 'react';

interface DemoButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

const DemoButton: FC<DemoButtonProps> = ({ label, onClick, variant = 'primary' }) => {
  const baseClasses = "font-bold px-6 py-3 rounded-2xl transition-all shadow-lg active:scale-95";
  const variants = {
    primary: "bg-blue-900 text-white hover:bg-blue-800 shadow-blue-900/20",
    secondary: "bg-white text-gray-700 border-2 border-gray-100 hover:bg-gray-50 shadow-gray-900/5"
  };

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

export default DemoButton;
