import { Request } from "express";
import { validate } from "../validation/validation";
import { categoryValidation } from "../validation/category-validation";
import { user_id } from "../../interfaces/Product";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";

const isCategoryAvailable = async (category_id: number, user_id: number) => {
  const isExist = await db.categeory.count({
    where: {
      id: category_id,
      user_id,
    },
  });
  if (!isExist) throw new ResponseError(404, "Category not found");
  return { category_id, user_id };
};

type Category<T = number | undefined> = {
  id?: number;
  name: string;
  user_id: T;
};
const create = async (req: Request) => {
  const category: Category<user_id> = validate(categoryValidation, req.body);
  const user = req.user;
  category.user_id = user.id;

  return db.categeory.create({
    data: category,
    select: {
      id: true,
      name: true,
    },
  });
};

const list = async (req: Request) => {
  const { id } = req.user;
  return db.categeory.findMany({
    where: {
      user_id: id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

const update = async (req: Request<{ id: number }>) => {
  const { user_id, category_id } = await isCategoryAvailable(
    req.params.id,
    req.user.id
  );
  const categeory: Category = validate(categoryValidation, req.body);
  return db.categeory.update({
    data: categeory,
    where: {
      id: category_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
    },
  });
};

const remove = async (req: Request<{ id: number }>) => {
  const { user_id, category_id } = await isCategoryAvailable(
    req.params.id,
    req.user.id
  );
  return await db.categeory.delete({
    where: {
      id: category_id,
      user_id,
    },
  });
};

export default { create, list, update, remove };
