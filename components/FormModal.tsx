import { DocumentNode } from "graphql";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import Button from "./Button";
import Form, { InputMap } from "./Forms/Form";
import Modal from "./Modal";

interface FormModalProp<T> {
  mutationQuery: DocumentNode;
  fields: string;
  openMessage?: string;
  submitName?: string;
  addedValueMap?: object;
  successMessage?: string;
  editAttributes: InputMap<T>[];
  afterSubmit?: (e: T) => void;
  onValueChange?: (e: string, x: string | number | boolean) => void;
}

export default function FormModal<T>({
  mutationQuery,
  fields,
  editAttributes,
  addedValueMap,
  onValueChange,
  openMessage,
  submitName,
  afterSubmit,
  successMessage,
}: FormModalProp<T>) {
  const [open, setOpen] = useState(false);

  const flip = () => setOpen(!open);

  return (
    <>
      <Button className="mb-4" onClick={flip}>
        {openMessage ?? "BUAT DATA"}
      </Button>
      {open && (
        <Modal open={open} flip={flip}>
          <div className="p-6">
            <Button color="RED" onClick={flip}>
              <MdClose color="white" size="1.5em" />
            </Button>
            <Form
              addedValueMap={addedValueMap}
              onValueChange={onValueChange}
              fields={fields}
              submitName={submitName ?? "BUAT DATA"}
              attributes={editAttributes}
              mutationQuery={mutationQuery}
              successMessage={successMessage}
              afterSubmit={(e) => {
                flip();
                afterSubmit && afterSubmit(e);
              }}
            />
          </div>
        </Modal>
      )}
    </>
  );
}
