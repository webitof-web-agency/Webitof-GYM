'use client';

import { InfinitySpin } from 'react-loader-spinner';

const PageLoader = ({ className = 'min-h-[40vh]' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <InfinitySpin width='140' color='#F97316' />
    </div>
  );
};

export default PageLoader;

