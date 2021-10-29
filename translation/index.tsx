import { get } from "lodash";

const MAP = {
  GENERAL: "Umum",
  VOCATIONAL: "Vokasi / Jurusan",
  LOCAL_CONTENT: "Muatan Lokal",
  SPECIAL_DEVELOPMENT: "Pengembangan",

  MULTI_CHOICE: "Pilihan Ganda",
  ESSAY: "Essai",
  FILLER: "Isian",
};

export const getTranslation = (key: string) => {
  return get(MAP, key);
};
