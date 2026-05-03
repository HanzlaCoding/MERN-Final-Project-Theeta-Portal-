import React from 'react';

const InputField = ({ label, id, type = 'text', value, onChange, placeholder, required }) => {
  return (
    <div className="flex flex-col group w-full mb-6 relative">
      {/* Ultra-minimalist label */}
      <label htmlFor={id} className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">
        {label} {required && <span className="text-lime-500 ml-1">*</span>}
      </label>
      
      {/* Bottom-border-only input */}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-slate-700/80 px-1 py-2 text-slate-50 placeholder-slate-600 focus:outline-none focus:border-lime-400 transition-colors duration-300"
      />
    </div>
  );
};

export default InputField;
