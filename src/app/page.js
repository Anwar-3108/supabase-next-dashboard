// Home.js

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import CustomTable with SSR disabled (only render on the client side)
const CustomTable = dynamic(() => import('../components/CustomTable'), {

  loading: () => <SkeletonLayout />, // Show skeleton while loading
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
        {/* Repeat skeleton rows if necessary */}
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
