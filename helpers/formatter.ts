export const formatCurrency = (e: number | undefined | null) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(
    e ?? 0
  );

export const wildCardFormatter = (e: string) => "%" + e + "%";

export const htmlStripper = (e: string) => e.replace(/(<([^>]+)>)/gi, "");
