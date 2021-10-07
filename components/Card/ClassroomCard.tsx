import { take } from "lodash";
import moment from "moment";
import Link from "next/link";
import React from "react";
import { Classroom } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";
import {
  getNotificationFormat,
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
    <div
      className="shadow rounded"
      style={{
        minHeight: 300,
      }}
    >
      <Link href={"/dashboard/classrooms/" + id}>
        <a>
          <div className="bg-blue-400 p-4 flex flex-col gap-2 text-white">
            <h1 className="text-lg font-semibold">{name}</h1>
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <ImageContainer
                  src={user.cover?.path}
                  fallback="profile"
                  className="rounded-full w-12 h-12"
                />{" "}
                <p className="pt-2">{user.name}</p>
              </div>
            </div>
          </div>
        </a>
      </Link>
      <div className="flex flex-col gap-2 overflow-x-auto pl-2 pt-2">
        {notifications?.length == 0 && (
          <p className="">tidak ada acara dikelas ini</p>
        )}
        {take(notifications, 2)?.map(({ data, id }) => {
          const typeFormatted = getNotificationFormat(data?.type);
          return (
            <Link
              key={id}
              href={"/dashboard/" + typeFormatted + "/" + data?.id}
            >
              <a>
                <div className="hover:bg-gray-100 flex gap-2" key={id}>
                  <p className="text-gray-600">
                    {moment(data?.finish_at).format("HH:MM D/M")}{" "}
                  </p>
                  <span>-</span>
                  <h2 className="text-sm font-semibold text-gray-800">
                    {data?.name}
                  </h2>
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
