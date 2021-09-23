import React from "react";

export default function SkeletonGrid({
  SkeletonComponent,
  className,
  total,
}: {
  SkeletonComponent?: () => JSX.Element;
  className?: string;
  total: number;
}) {
  return (
    <div>
      <div className={className}>
        {SkeletonComponent &&
          [...Array(total)].map((e, i) => <SkeletonComponent key={i} />)}
      </div>
    </div>
  );
}
