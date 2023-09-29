import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";

export const isProductExist = async (user_id: number, product_id: number) => {
  const count = await db.product.count({
    where: {
      id: product_id,
      user_id,
    },
  });
  if (count == 0) throw new ResponseError(404, "Product not found");
};
