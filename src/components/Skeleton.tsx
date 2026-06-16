import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'input' | 'list' | 'rect';
  className?: string;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ type = 'rect', className = '', count = 1 }) => {
  const renderItems = () => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(
        <div key={i} className={`animate-pulse bg-slate-200 rounded-md ${className}`}>
          {type === 'card' && (
            <div className="p-6 space-y-4">
              <div className="h-6 w-1/3 bg-slate-300 rounded-sm"></div>
              <hr className="border-slate-100" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-3 w-1/4 bg-slate-300 rounded-sm"></div>
                  <div className="h-10 bg-slate-300 rounded-md"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-1/3 bg-slate-300 rounded-sm"></div>
                  <div className="h-10 bg-slate-300 rounded-md"></div>
                </div>
              </div>
              <div className="h-12 w-full bg-slate-300 rounded-md mt-6"></div>
            </div>
          )}

          {type === 'input' && (
            <div className="space-y-2 p-2">
              <div className="h-3 w-1/4 bg-slate-300 rounded-sm"></div>
              <div className="h-10 w-full bg-slate-300 rounded-md"></div>
            </div>
          )}

          {type === 'list' && (
            <div className="flex items-center space-x-4 p-4 border-b border-slate-100">
              <div className="h-10 w-10 bg-slate-300 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-1/4 bg-slate-300 rounded-sm"></div>
                <div className="h-3 w-3/4 bg-slate-300 rounded-sm"></div>
              </div>
            </div>
          )}

          {type === 'rect' && <div className="h-8 w-full bg-slate-300 rounded-md"></div>}
        </div>
      );
    }
    return items;
  };

  return <div className="space-y-4">{renderItems()}</div>;
};
