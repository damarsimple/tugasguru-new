import Link from "next/link";
import React from "react";
import { User } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";

export default function FollowCard({
  user,
  children,
}: {
  user: User;
  children?: JSX.Element | JSX.Element | string;
}) {
  return (
    <div className="shadow-lg rounded-2xl bg-white dark:bg-gray-800 p-4">
      <div className="gap-4 flex justify-between">
        <Link href={`/users/${user.username}`}>
          <a>
            <div className="flex gap-2">
              <div>
                <ImageContainer
                  fallback="profile"
                  src={user.cover?.path}
                  className="mx-auto object-cover rounded-full h-16 w-16 "
                />
              </div>
              <div className=" flex flex-col gap-1">
                <span className="text-gray-600 dark:text-white text-xl font-medium">
                  {user.name}
                </span>
                <span className="text-gray-400 text-md">
                  {user.roles} {user.school?.name}
                </span>
              </div>
            </div>
          </a>
        </Link>
        {children}
      </div>
    </div>
  );
}
