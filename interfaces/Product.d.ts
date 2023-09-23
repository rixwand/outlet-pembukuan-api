export interface Product<T = number | undefined, id = number | undefined> {
  id: id;
  name: string;
  category_id: number;
  stock: number;
  basic_price: number;
  selling_price: number;
  user_id: T;
}
export type user_id = number;
