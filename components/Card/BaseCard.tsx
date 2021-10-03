import React from "react";
import { Document } from "../../types/type";

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
      <div className="font-semibold text-center bg-gray-200 h-6 animate-pulse " />
    </div>
  );
}
