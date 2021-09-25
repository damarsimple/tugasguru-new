import Link from "next/link";
import React from "react";
import { Announcement } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";

export default function AnnouncementCard({
  id,
  name,
  user,
  cover,
}: Announcement) {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-white flex flex-col gap-2">
      <div className="w-full">
        <Link href={"/announcement/" + id}>
          <a>
            <ImageContainer
              src={cover?.path}
              fallback="quiz"
              className="w-full"
            />
          </a>
        </Link>
      </div>
      <Link href={"/announcement/" + id}>
        <a>
          <h1 className="text-md justify-between font-bold m-3">{name}</h1>
        </a>
      </Link>

      <Link href="users/">
        <a>
          <div className="m-3 flex items-center py-2 gap-2">
            <ImageContainer
              className="w-6 h-6 rounded-full"
              src={user.cover?.path}
              fallback="profile"
            />
            <p className="text-gray-900 leading-none text-sm">{user.name}</p>
          </div>
        </a>
      </Link>
    </div>
  );
}

export function SkeletonAnnouncementCard() {
  return (
    <div className="rounded overflow-hidden shadow-lg bg-white flex flex-col gap-2">
      <div className="w-full">
        <div className="w-full h-36 animate-pulse bg-gray-200" />
      </div>
      <div className="h-6 animate-pulse bg-gray-100 m-4" />

      <div className="h-6 animate-pulse bg-gray-100 m-4" />
    </div>
  );
}
