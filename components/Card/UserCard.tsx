import React from "react";
import Image from "next/image";
import Link from "next/link";
import { User } from "../../types/type";
import Button from "../Button";
import ImageContainer from "../Container/ImageContainer";

interface UserProp extends User {
  clickAction?: () => void;
  actionLabel?: string;
}

export default function UserCard(e: UserProp) {
  return (
    <div className="flex flex-col gap-2 text-center shadow rounded p-4">
      <div className="flex justify-center">
        <ImageContainer
          fallback="profile"
          className="rounded-full h-24 w-24"
          src={e.cover?.path}
          alt="Picture of the author"
          width={500}
          height={500}
        />
      </div>
      <h1 className="text-md sm:text-lg font-semibold truncate">{e.name}</h1>
      <p className="text-sm sm:text-md truncate">@{e.username}</p>
      <p className="text-sm truncate">{e.roles}</p>
      {e.clickAction ? (
        <Button color="GRAY" onClick={e.clickAction}>
          {e.actionLabel ?? "..."}
        </Button>
      ) : (
        <Link href={"/users/" + e.username}>
          <a>
            <Button color="GRAY">BIMBEL</Button>
          </a>
        </Link>
      )}
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 text-center shadow rounded p-4">
      <div className="flex justify-center">
        <div className="rounded-full h-36 w-36 animate-pulse bg-gray-200" />
      </div>
      <h1 className="bg-gray-100 rounded animate-pulse"></h1>
      <p className="h-6 bg-gray-100 rounded animate-pulse"></p>
      <p className="h-6 bg-gray-100 rounded animate-pulse"></p>
      <Button color="GRAY" loading>
        ...
      </Button>
    </div>
  );
}
