import moment from "moment";
import React from "react";
import { BiPlay } from "react-icons/bi";
import { MdNotifications } from "react-icons/md";
import { Notification } from "../../types/type";
import Button from "../Button";
import ImageContainer from "../Container/ImageContainer";

export const NotificationTranslationMap: { [e: string]: string } = {
  assigment: "Tugas",
  exam: "Ujian",
};

export const getNotificationFormat = (DataType?: string | null) =>
  DataType?.replace("App\\Models\\", "").toLowerCase();

export default function NotificationCard({
  data,
  type,
  read_at,
}: Notification) {
  const {
    message,
    id,
    start_at,
    finish_at,
    picture,
    type: DataType,
    name,
    definition,
  } = data || {};

  const typeFormatted = getNotificationFormat(DataType);

  return (
    <div className="flex flex-col lg:flex-row w-full bg-white hover:bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div
        className={"w-6 h-full " + (read_at ? "bg-blue-800 " : "bg-red-800 ")}
      />
      <div className="flex w-full items-center px-2 py-3">
        {picture ? (
          <ImageContainer
            className="w-16 h-16 object-cover rounded-full"
            fallback="profile"
            src={picture?.path}
          />
        ) : (
          <MdNotifications className="w-16 h-16 object-cover rounded-full" />
        )}

        <div className="mx-3">
          <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
          <p className="text-gray-600">{message}</p>
          <p className="text-gray-600">
            {typeFormatted
              ? NotificationTranslationMap[typeFormatted]
              : typeFormatted}
          </p>
          <p className="text-gray-600">
            {moment(start_at).format("HH:MM D/M")} sampai{" "}
            {moment(finish_at).format("HH:MM D/M")}{" "}
          </p>
        </div>
      </div>
      <div className="p-4 flex items-center">
        <Button href={typeFormatted + "/" + id}>
          <BiPlay size="1.5em" />
        </Button>
      </div>
    </div>
  );
}

export function NotificationCardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col w-full bg-white hover:bg-gray-100 shadow-lg rounded-lg overflow-hidden">
      <div className="w-2 bg-gray-100 animate-pulse"></div>
      <div className="flex w-full items-center px-2 py-3">
        <div className="w-16 h-16 object-cover rounded-full animate-pulse" />
        {/* <MdNotifications className="w-16 h-16 object-cover rounded-full" /> */}
        <div className="mx-3">
          <h2 className="text-xl h-10 font-semibold bg-gray-800 animate-pulse" />
          <p className="bg-gray-200 h-6 animate-pulse" />
          <p className="bg-gray-200 h-6 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
