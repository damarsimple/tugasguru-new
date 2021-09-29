import { DocumentNode } from "graphql";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Form, { InputMap } from "./Forms/Form";
import Modal from "./Modal";

interface FormModalProp<T> {
  createQuery: DocumentNode;
  fields: string;
  openMessage?: string;
  submitName?: string;
  editAttributes: InputMap<T>[];
  afterSubmit?: (e: T) => void;
  onValueChange?: (e: string, x: string | number | boolean) => void;
}

export default function FormModal<T>({
  createQuery,
  fields,
  editAttributes,
  onValueChange,
  openMessage,
  submitName,
  afterSubmit,
}: FormModalProp<T>) {
  const [open, setOpen] = useState(false);

  const flip = () => setOpen(!open);

  if (!open)
    return (
      <Button className="my-10" onClick={flip}>
        {openMessage ?? "BUAT DATA"}
      </Button>
    );

  return (
    <Modal open={open} flip={flip}>
      <div className="p-6">
        <Button color="RED" onClick={flip}>
          <MdClose color="white" size="1.5em" />
        </Button>
        <Form
          onValueChange={onValueChange}
          fields={fields}
          submitName={submitName ?? "BUAT DATA"}
          attributes={editAttributes}
          mutationQuery={createQuery}
          afterSubmit={(e) => {
            flip();
            afterSubmit && afterSubmit(e);
          }}
        />
      </div>
    </Modal>
  );
}
