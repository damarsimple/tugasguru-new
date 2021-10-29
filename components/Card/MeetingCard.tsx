import React from "react";
import { Meeting } from "../../types/type";
import Button from "../Button";

interface MeetingCardProp extends Meeting {
  buttonLabel?: string;
}

export default function MeetingCard(e: MeetingCardProp) {
  return (
    <div className="shadow rounded">
      <div className="p-4">
        <h2 className="text-gray-900 font-bold text-lg truncate">{e.name}</h2>
        <p className="mt-2 text-gray-600 text-sm">{e.metadata?.description}</p>

        <div className="flex flex-col gap-2 mt-3">
          <Button href={"/meetings/" + e.id}>
            {e.buttonLabel ?? "Buka Meeting"}
          </Button>
        </div>
      </div>
    </div>
  );
}
