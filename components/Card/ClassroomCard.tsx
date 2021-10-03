import { take } from "lodash";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { Classroom } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";
import NotificationCard, {
  getNotificationFormat,
  NotificationCardSkeleton,
  NotificationTranslationMap,
} from "./NotificationCard";

export default function ClassroomCard({
  name,
  user,
  notifications,
  id,
  school,
}: Classroom) {
  return (
    <div className="shadow rounded">
      <Link href={"/dashboard/classrooms/" + id}>
        <a>
          <div className="bg-blue-400 p-4 flex flex-col gap-2 text-white">
            <h1 className="text-lg font-semibold text-center">{name}</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <ImageContainer
                  src={user.cover?.path}
                  fallback="profile"
                  className="rounded-full w-12 h-12"
                />{" "}
                <p className="pt-2">{user.name}</p>
              </div>
              <div className="flex gap-2 items-center">
                <p className="pt-2">{school.name}</p>{" "}
                <ImageContainer
                  src={school.cover?.path}
                  fallback="profile"
                  className="rounded-full w-12 h-12"
                />
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-col gap-2">
        {take(notifications, 2)?.map(({ data, id }) => {
          const typeFormatted = getNotificationFormat(data?.type);
          return (
            <Link
              key={id}
              href={"/dashboard/" + typeFormatted + "/" + data?.id}
            >
              <a>
                <div
                  className="mx-3 border-t-2 border-black hover:bg-gray-100"
                  key={id}
                >
                  <h2 className="text-xl font-semibold text-gray-800">
                    {data?.name}
                  </h2>
                  <p className="text-gray-600">{data?.message}</p>
                  <p className="text-gray-600">
                    {typeFormatted
                      ? NotificationTranslationMap[typeFormatted]
                      : typeFormatted}
                  </p>
                  <p className="text-gray-600">
                    {moment(data?.start_at).format("HH:MM D/M")} sampai{" "}
                    {moment(data?.finish_at).format("HH:MM D/M")}{" "}
                  </p>
                </div>
              </a>
            </Link>
          );
        })}
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
