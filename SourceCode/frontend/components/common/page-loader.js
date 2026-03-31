'use client';

import { InfinitySpin } from 'react-loader-spinner';

const PageLoader = ({ className = 'min-h-[40vh]' }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <InfinitySpin width='140' color='#5572fc' />
    </div>
  );
};

export default PageLoader;
