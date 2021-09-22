import React from "react";
import { User } from "../../types/type";
import ImageContainer from "../Container/ImageContainer";

export default function FriendCard(e: User) {
  return (
    <div className="grid grid-cols-5 bg-gray-900 p-4 shadow rounded">
      <div className="col-span-1">
        <ImageContainer
          className="rounded-full"
          fallback="profile"
          src={e.cover?.path}
          height={50}
          width={50}
        />
      </div>
      <div className="col-span-3 ">
        <h1 className="text-white uppercase text-lg font-bold">{e.name}</h1>
        <p className=" text-white uppercase text-md font-semibold">{e.roles}</p>
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}
