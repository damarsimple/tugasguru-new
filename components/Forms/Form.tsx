import { DocumentNode, useMutation } from "@apollo/client";
import { get } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import create from "zustand";
import Button from "../Button";
import Input from "./Input";

export interface SelectValue {
  name: string;
  value: string;
}
export interface InputMap<T> {
  name: keyof T | string;
  type?: string;
  label: string;
  required?: boolean;
  information?: string;
  values?: SelectValue[];
}

type FormMap = Record<string, object>;
interface FormDefaultStore {
  defaultStore: FormMap;
  setDefaultStore: (e: FormMap) => void;
}

export const useDefaultMap = create<FormDefaultStore>((set) => ({
  defaultStore: {},
  setDefaultStore: (defaultStore: FormMap) => set({ defaultStore }),
}));

type StringMap = { [e: string]: string };
interface FormProp<T, N> {
  attributes: InputMap<T>[];
  mutationQuery: DocumentNode;
  beforeSubmit?: (e: StringMap) => void;
  afterSubmit?: (e: T) => void;
  defaultValueMap?: Partial<T>;
  addedValueMap?: object;
  successMessage?: string;
  fields: keyof N;
  submitName?: string;
  onValueChange?: (name: string, value: string | number | boolean) => void;
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
  onValueChange,
}: FormProp<T, N>) {
  const [
    mutateFunction,
    { data: mutationData, loading: mutationLoading, error: mutationError },
  ] = useMutation<N>(mutationQuery, {});

  const [inputMap, setInputMap] = useState<T | object>(defaultValueMap ?? {});

  const formRef = useRef(null);

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

    const requireds = attributes.filter((e) => e.required).map((e) => e.name);

    for (const x of requireds) {
      //@ts-ignore
      if (!inputMap[x] && !getDefault(x)) {
        toast.error("Anda belum mengisi " + x);
        return;
      }
    }

    const submitMap = checkHasMetadataField()
      ? {
          ...defaultStore[fields as string],
          ...inputMap,
          metadata: getMetadata(),
        }
      : { ...defaultStore[fields as string], ...inputMap };

    if (beforeSubmit) {
      try {
        beforeSubmit(submitMap as StringMap);
      } catch (error) {
        toast.error(`${error}`);
        return;
      }
    }
    mutateFunction({
      variables: { ...addedValueMap, ...defaultValueMap, ...submitMap },
    })
      .then((e) => {
        afterSubmit && e.data && afterSubmit(e.data[fields] as any);
        successMessage && toast.success(successMessage);
        setDefaultStore({ ...defaultStore, [fields as string]: {} });
        //@ts-ignore
        formRef.current?.reset();
      })
      .catch((e) => toast.error(mutationError?.message));
  };

  const { defaultStore, setDefaultStore } = useDefaultMap();

  const handleValueChange = (e: string, x: boolean | string | number) => {
    setInputMap({ ...inputMap, [e]: x });
    setDefaultStore({
      ...defaultStore,
      [fields as string]: {
        ...defaultStore[fields as string],
        [e]: x,
      },
    });
    onValueChange && onValueChange(e, x);
  };

  const getDefault = (name: any) =>
    (defaultValueMap && get(defaultValueMap, name)) ??
    get(defaultStore[fields as string], name);
  return (
    <form onSubmit={handleSubmit} ref={formRef}>
      {attributes.map((e) => (
        <Input
          key={e.name as string}
          defaultValue={getDefault(e.name)}
          defaultChecked={getDefault(e.name)}
          label={e.label ?? e.name}
          name={e.name as string}
          type={e.type}
          onTextChange={(x) => handleValueChange(e.name as string, x)}
          onCheckChange={(x) => handleValueChange(e.name as string, x)}
          required={e.required}
          information={e.information}
          values={e.values}
        />
      ))}
      <Button loading={mutationLoading} type="submit" color="BLUE">
        {submitName ?? "SIMPAN"}
      </Button>
    </form>
  );
}
