import React from 'react';
import classNames from 'classnames';

const Button = ({ children, onClick, type = 'button', variant = 'primary', isLoading = false, className = '' }) => {
  const baseClasses = "flex justify-center items-center py-3 px-6 rounded-full font-bold tracking-[0.1em] uppercase text-xs focus:outline-none transition-all duration-300";
  
  const variantClasses = {
    primary: "text-slate-950 bg-lime-500 hover:bg-lime-400 shadow-[0_0_20px_rgba(132,204,22,0.3)] hover:shadow-[0_0_30px_rgba(132,204,22,0.5)] border border-lime-400",
    secondary: "text-slate-300 bg-transparent border border-slate-700 hover:bg-slate-800 hover:text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={classNames(baseClasses, variantClasses[variant], className, {
        'opacity-50 cursor-not-allowed shadow-none hover:shadow-none hover:bg-lime-500': isLoading
      })}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default Button;
