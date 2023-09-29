import { Request } from "express";
import { validate } from "../validation/validation";
import {
  createProductValidation,
  updateProductValidation,
} from "../validation/product-validation";
import { Product, user_id } from "../../interfaces/Product";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import { params } from "../../interfaces/RouterHandler";
import { isProductExist } from "../helper/product-helper";
import { idValidation } from "../validation/user-validation";

const isCategoryExist = async (category_id: number) => {
  return (
    (await db.category.count({
      where: {
        id: category_id,
      },
    })) != 0
  );
};

const create = async (req: Request) => {
  const product: Product<user_id> = validate(createProductValidation, req.body);
  const user = req.user;
  product.user_id = user.id;

  if (!(await isCategoryExist(product.category_id)))
    throw new ResponseError(404, "Category not found");

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

const list = async (
  req: Request<{}, {}, {}, { filter: [string] | string; search: string }>
) => {
  let filter = req.query.filter;
  if (typeof filter === "string") filter = [filter];
  const search = req.query.search;
  const user_id = req.user.id;

  let conditionFilter: Array<{ category: { name: string } }> = [];
  if (filter) {
    filter.forEach((value) => {
      conditionFilter.push({
        category: {
          name: value,
        },
      });
    });
  }
  const product = await db.product.findMany({
    where: {
      AND: [
        { user_id },
        { OR: conditionFilter },
        { name: { contains: search } },
      ],
    },
    select: {
      id: true,
      name: true,
      category: {
        select: { name: true },
      },
      stock: true,
      basic_price: true,
      selling_price: true,
    },
  });
  if (!product) throw new ResponseError(404, "Product not found");
  return product;
};

const update = async (req: Request<params>) => {
  const product_id = validate(idValidation, req.params.id);
  const product = validate(updateProductValidation, req.body);
  const user = req.user;
  await isProductExist(user.id, product_id);
  await db.product.update({
    where: {
      id: product_id,
      user_id: user.id,
    },
    data: product,
    select: {
      id: true,
      name: true,
      category: {
        select: { name: true },
      },
      stock: true,
      basic_price: true,
      selling_price: true,
    },
  });
};

const get = async (req: Request<params>) => {
  const user_id = req.user.id;
  const product_id = validate(idValidation, req.params.id);
  await isProductExist(user_id, product_id);
  const product = await db.product.findUnique({
    where: {
      id: product_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
      category: {
        select: { name: true },
      },
      stock: true,
      basic_price: true,
      selling_price: true,
    },
  });
  return product;
};

const remove = async (req: Request<params>) => {
  const product_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isProductExist(user_id, product_id);
  return db.product.delete({
    where: {
      id: product_id,
      user_id,
    },
    select: {
      id: true,
    },
  });
};

export default { create, list, update, get, remove };
