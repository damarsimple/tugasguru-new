import React from "react";

interface BaseModel {
  name: String;
}

export default function BaseCard({ name }: BaseModel) {
  return (
    <div className="shadow rounded p-4">
      <h1 className="text-lg font-semibold text-center">{name}</h1>
    </div>
  );
}

export function BaseCardSkeleton() {
  return (
    <div className="shadow rounded p-4">
      <h1 className="font-semibold text-center h-6 animate-pulse " />
    </div>
  );
}
