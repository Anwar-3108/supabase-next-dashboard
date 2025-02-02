

import dynamic from 'next/dynamic';
import { Suspense } from 'react';


const CustomTable = dynamic(() => import('../components/CustomTable'), {

  loading: () => <SkeletonLayout />,
});

const SkeletonLayout = () => {
  return (
    <div className="skeleton-container">
      <div className="skeleton-table">
        <div className="skeleton-row">
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
        </div>
  
        <div className="skeleton-row">
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
          <div className="skeleton-column"></div>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLayout />}>
      <CustomTable />
    </Suspense>
  );
}
