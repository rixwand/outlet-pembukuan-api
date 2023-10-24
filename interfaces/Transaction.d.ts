import { Product } from "./Product";

type Receivable = {
  total: number;
  note: string;
  paid: boolean;
};

export interface Sale<T = number | undefined, R = undefined> {
  id: T;
  name: string;
  category: string;
  basic_price: number;
  selling_price: number;
  receivable: R;
  user_id?: number;
}

type ProductSale = Sale & {
  product: Product<undefined, undefined> & { created_at: string };
};

export interface Expense<T = number | undefined, D = undefined> {
  id: T;
  name: string;
  total: number;
  debt: D;
  user_id?: number;
}

type Debt = Receivable;

export type ListQuery = {
  time: Array<Date>;
  search: string;
  paid: boolean;
};
