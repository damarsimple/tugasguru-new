import { SelectValue } from "./Forms/Form";

export const SimpleSelect = ({
  onChange,
  values,
  label,
  defaultValue,
}: {
  onChange: (e: string) => void;
  values: SelectValue[];
  label?: string;
  defaultValue?: number | string;
}) => (
  <div className="gap-2 flex flex-col">
    {label && <label className="font-semibold">{label}</label>}
    <select
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className="p-4 shadow rounded w-full"
      placeholder="Pilih"
      autoComplete="off"
    >
      <option value="null">Pilih</option>
      {values.map((e) => (
        <option key={e.name} value={e.value}>
          {e.name}
        </option>
      ))}
    </select>
  </div>
);
