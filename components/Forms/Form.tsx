import { DocumentNode, useMutation } from "@apollo/client";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "../Button";
import Input from "./Input";

interface InputMap<T> {
  name: keyof T | string;
  type?: string;
  label: string;
  required?: boolean;
  information?: string;
}

interface FormProp<T, N> {
  attributes: InputMap<T>[];
  mutationQuery: DocumentNode;
  beforeSubmit?: () => void;
  afterSubmit?: (e: T) => void;
  defaultValueMap?: Partial<T>;
  addedValueMap?: object;
  successMessage?: string;
  fields: keyof N;
  submitName?: string;
}

export default function Form<T, N>({
  attributes,
  mutationQuery,
  defaultValueMap,
  addedValueMap,
  beforeSubmit,
  afterSubmit,
  fields,
  successMessage,
  submitName,
}: FormProp<T, N>) {
  const [
    mutateFunction,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<N>(mutationQuery, {});

  const [inputMap, setInputMap] = useState<T | object>(defaultValueMap ?? {});

  const checkHasMetadataField = () => {
    for (const attr of attributes) {
      if (attr.name.toString().includes("metadata")) return true;
    }
    return false;
  };

  const getMetadata = () => {
    const metadata = {};
    for (const x in inputMap as object) {
      if (x.includes("metadata.")) {
        //@ts-ignore
        metadata[x.replace("metadata.", "")] = inputMap[x];
      }
    }

    return JSON.stringify(metadata);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (beforeSubmit) {
      try {
        beforeSubmit();
      } catch (error) {
        toast.error("Error: " + error);
        return;
      }
    }

    const requireds = attributes.filter((e) => e.required).map((e) => e.name);

    for (const x of requireds) {
      //@ts-ignore
      if (!inputMap[x]) {
        toast.error("Anda belum mengisi " + x);
        return;
      }
    }

    const submitMap = checkHasMetadataField()
      ? {
          ...inputMap,
          metadata: getMetadata(),
        }
      : inputMap;

    console.log(submitMap);
    mutateFunction({
      variables: { ...addedValueMap, ...defaultValueMap, ...submitMap },
    })
      .then((e) => {
        afterSubmit && e.data && afterSubmit(e.data[fields] as any);
        successMessage && toast.success(successMessage);
      })
      .catch((e) => toast.error(mutationError?.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      {attributes.map((e) => (
        <Input
          key={e.name as string}
          defaultValue={defaultValueMap && get(defaultValueMap, e.name)}
          defaultChecked={defaultValueMap && get(defaultValueMap, e.name)}
          label={e.label ?? e.name}
          name={e.name as string}
          type={e.type}
          onTextChange={(x) => setInputMap({ ...inputMap, [e.name]: x })}
          onCheckChange={(x) => setInputMap({ ...inputMap, [e.name]: x })}
          required={e.required}
          information={e.information}
        />
      ))}
      <Button loading={mutationLoading} type="submit" color="BLUE">
        {submitName ?? "SIMPAN"}
      </Button>
    </form>
  );
}
