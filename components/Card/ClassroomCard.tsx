import { take } from "lodash";
import Link from "next/link";
import React from "react";
import { Classroom } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";
import NotificationCard, { NotificationCardSkeleton } from "./NotificationCard";

export default function ClassroomCard({
  name,
  user,
  notifications,
  id,
}: Classroom) {
  return (
    <div className="shadow rounded">
      <Link href={"/dashboard/classrooms/" + id}>
        <a>
          <div className="bg-blue-400 p-4 flex flex-col gap-2 text-white">
            <h1 className="text-lg font-semibold text-center">{name}</h1>
            <div className="flex gap-2">
              <ImageContainer
                src={user.cover?.path}
                fallback="profile"
                className="rounded-full w-10 h-10"
              />{" "}
              <p className="pt-2">{user.name}</p>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-col gap-2">
        {take(notifications, 2)?.map((e) => (
          <NotificationCard key={e.id} {...e} />
        ))}
      </div>
    </div>
  );
}

export function ClassroomCardSkeleton() {
  return (
    <div className="shadow rounded p-4">
      <h1 className="font-semibold text-center h-6 animate-pulse " />
    </div>
  );
}
