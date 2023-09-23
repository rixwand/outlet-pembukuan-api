import { Request } from "express";
import { validate } from "../validation/validation";
import { createProductValidation } from "../validation/producValidation";
import { Product, user_id } from "../../interfaces/Product";
import { db } from "../app/db";

const create = async (req: Request) => {
  const product: Product<user_id> = validate(createProductValidation, req.body);
  const user = req.user;
  product.user_id = user.id;

  return await db.product.create({
    data: product,
    select: {
      id: true,
      name: true,
      category: true,
      stock: true,
      basic_price: true,
      selling_price: true,
    },
  });
};

export default { create };
