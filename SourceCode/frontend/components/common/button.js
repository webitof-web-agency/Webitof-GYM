'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  loadingText = 'Loading…',
  skipDemo,
  pathName,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname()
  const handleClick = async (event) => {
    if (type === 'submit') {
      setIsLoading(true);
    }
    if (onClick) {
      await onClick(event);
    }
    if (type === 'submit') {
      setIsLoading(false);
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`inline-flex items-center justify-center border-2 whitespace-pre transition-all duration-300 ease-in-out md:px-6 py-[10px] px-5 sm:text-[14px] text-[14px] font-semibold rounded-xl h-fit active:scale-[0.98] ${isLoading ? 'bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed shadow-none' : 'bg-[#5572fc] border-[#5572fc] text-white hover:bg-[#4660e5] hover:border-[#4660e5] hover:shadow-lg hover:shadow-[#5572fc]/25 shadow-md shadow-[#5572fc]/10'} ${pathName === 'home3' && pathname==="/" ? 'brightness-110' : ''} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default Button;
