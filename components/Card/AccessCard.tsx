import React from "react";
import { MdCheck } from "react-icons/md";
import { formatCurrency } from "../../helpers/formatter";
import { Access } from "../../types/type";
import Button from "../Button";

export default function AccessCard({
  name,
  price,
  ability,
  description,
}: Access) {
  return (
    <div className="shadow-md rounded-lg p-4 h-96 flex flex-col justify-between gap-3">
      <div>
        <h1 className="font-bold text-lg text-primary-base">{name}</h1>
        <p className="text-sm truncate">{description}</p>
      </div>

      <ul>
        {ability.map((e, i) => (
          <li className="flex gap-3" key={i}>
            <div>
              <MdCheck color="blue" size="1.5em" />
            </div>
            <div>
              <p>{e}</p>
            </div>
          </li>
        ))}
      </ul>
      <hr />
      <div>
        <p>Mulai dari</p>
        <p>
          <strong>{formatCurrency(price)} / 6 bulan</strong>
        </p>
      </div>
      <Button>Beli Paket</Button>
    </div>
  );
}

export function AccessCardSkeleton() {
  return (
    <div className="grid grid-cols-3 p-4 pt-10">
      <div className="shadow-md rounded-lg p-4 h-96 flex flex-col gap-3">
        <div className="animate-pulse h-10 bg-gray-200" />
        <div className="animate-pulse h-6 bg-gray-100" />

        <ul className="flex flex-col gap-1">
          {[...Array(6)].map((e, i) => (
            <li className="flex gap-3" key={i}>
              <div className="animate-pulse h-4 bg-gray-100 w-full" />
            </li>
          ))}
        </ul>
        <hr />
        <div className="animate-pulse h-6 bg-gray-100" />
        <p>
          <div className="animate-pulse h-8 bg-gray-300" />
        </p>
        <Button loading>Loading...</Button>
      </div>
    </div>
  );
}
