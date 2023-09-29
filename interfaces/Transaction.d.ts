import { Product } from "./Product";

export interface Sale<T = number | undefined> {
  id: T;
  name: string;
  category: string;
  basic_price: number;
  selling_price: number;
  receivable: boolean;
  user_id?: number;
}

type ProductSale = Sale & {
  product: Product<undefined, undefined> & { created_at: string };
};

export interface Expense<T = number | undefined> {
  id: T;
  name: string;
  total: number;
  user_id?: number;
}
