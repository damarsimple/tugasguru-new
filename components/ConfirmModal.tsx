import { DocumentNode } from "graphql";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Form, { InputMap } from "./Forms/Form";
import Modal from "./Modal";

export default function ConfirmModal<T>({
  openMessage,
  next,
}: {
  openMessage: string;
  next: () => void;
}) {
  const [open, setOpen] = useState(false);

  const flip = () => setOpen(!open);

  return (
    <>
      <Button className="mb-4" color="RED" onClick={flip}>
        {openMessage ?? "BUAT DATA"}
      </Button>
      {open && (
        <Modal open={open} flip={flip}>
          <div className="p-6">
            <Button
              onClick={() => {
                flip();
                next();
              }}
              color="GREEN"
            >
              Yakin
            </Button>
            <Button color="RED" onClick={flip}>
              <MdClose color="white" size="1.5em" />
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
