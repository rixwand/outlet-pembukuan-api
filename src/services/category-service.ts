import { Request } from "express";
import { validate } from "../validation/validation";
import { categoryValidation } from "../validation/category-validation";
import { user_id } from "../../interfaces/Product";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import { idValidation } from "../validation/user-validation";

const isCategoryAvailable = async (category_id: number, user_id: number) => {
  const isExist = await db.category.findFirst({
    where: {
      id: category_id,
      user_id,
    },
    select: {
      name: true,
    },
  });
  if (!isExist) throw new ResponseError(404, "Category not found");
  return { category_id, user_id, category_name: isExist.name };
};
const isCategoryAlreadyExist = async (
  user_id: number,
  category_name: string
) => {
  return (
    (await db.category.count({
      where: {
        name: category_name,
        user_id,
      },
    })) != 0
  );
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
  if (await isCategoryAlreadyExist(user.id, category.name))
    throw new ResponseError(409, "Category is already exist");

  return db.category.create({
    data: category,
    select: {
      id: true,
      name: true,
    },
  });
};

const list = async (req: Request) => {
  const { id } = req.user;
  return db.category.findMany({
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
  const { user_id, category_id, category_name } = await isCategoryAvailable(
    validate(idValidation, req.params.id),
    req.user.id
  );
  const category: Category = validate(categoryValidation, req.body);
  if (category.name === category_name) {
    return { id: category_id, name: category_name };
  }
  if (await isCategoryAlreadyExist(user_id, category.name))
    throw new ResponseError(409, "Category is already exist");

  return db.category.update({
    data: category,
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
    validate(idValidation, req.params.id),
    req.user.id
  );
  await db.category.delete({
    where: {
      id: category_id,
      user_id,
    },
  });
  return category_id;
};

export default { create, list, update, remove };
