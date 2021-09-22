import create from "zustand";
import { Product } from "../types/type";

interface CartStore {
  carts: ProductCart[];
  setCarts: (e: ProductCart[]) => void;
  removeCarts: (e: Product) => void;
  setQty: (e: Product, qty: number) => void;
}

interface ProductCart {
  qty: number;
  product: Product;
}

export const useCartsStore = create<CartStore>((set) => ({
  carts: [],
  setCarts: (carts) => set({ carts }),
  removeCarts: (e) =>
    set((state) => {
      return {
        ...state,
        carts: state.carts.filter((x) => x.product.id != e.id),
      };
    }),
  setQty: (e, qty) =>
    set((state) => {
      return {
        ...state,
        carts: state.carts
          .map((x) => {
            if (x.product.id == e.id) {
              return {
                ...x,
                qty,
              };
            }
            return x;
          })
          .filter((e) => e.qty != 0),
      };
    }),
}));

// function transforms(original: ProductCart[], value: string) {
//     const copy = original;

//  }
