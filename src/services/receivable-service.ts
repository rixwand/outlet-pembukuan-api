import { Prisma } from "@prisma/client";
import { ListQuery, Receivable } from "../../interfaces/Transaction";
import { UserInfo } from "../../interfaces/User";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import {
  createReceivableValidation,
  listReceivableValidation,
  updateReceivableValidation,
} from "../validation/receivable-validation";
import { idValidation } from "../validation/user-validation";
import { validate } from "../validation/validation";
import { isDateInvalid } from "../helper/validation-helper";
import { isSaleExist } from "./transaction-serivce";

const isReceivableExist = async (user_id: number, receivable_id: number) => {
  const count = await db.receivable.count({
    where: {
      id: receivable_id,
      user_id,
    },
  });
  if (count == 0) throw new ResponseError(404, "Receivable not found");
};

const returnValue: Prisma.ReceivableSelect = {
  id: true,
  total: true,
  note: true,
  paid: true,
  sale: {
    select: {
      name: true,
      category: true,
      created_at: true,
    },
  },
};

const create = async (
  user: UserInfo,
  data: Receivable & { sale_id: number }
) => {
  const { sale_id, ...receivable } = validate(createReceivableValidation, data);
  const hasReceivable = await isSaleExist(user.id, sale_id);
  if (hasReceivable)
    throw new ResponseError(409, "Sale already has receivable");
  return db.receivable.create({
    data: {
      ...receivable,
      user_id: user.id,
      sale_id,
    },
    select: returnValue,
  });
};

const get = async (user: UserInfo, id: number) => {
  id = validate(idValidation, id);
  await isReceivableExist(user.id, id);
  return db.receivable.findUnique({
    where: {
      id,
      user_id: user.id,
    },
    select: returnValue,
  });
};

const update = async (
  user: UserInfo,
  receivable_id: number,
  data: Receivable
) => {
  receivable_id = validate(idValidation, receivable_id);
  data = validate(updateReceivableValidation, data);
  await isReceivableExist(user.id, receivable_id);
  return db.receivable.update({
    data,
    where: {
      id: receivable_id,
      user_id: user.id,
    },
    select: returnValue,
  });
};

const remove = async (user: UserInfo, id: number) => {
  id = validate(idValidation, id);
  await isReceivableExist(user.id, id);
  return db.receivable.delete({
    where: {
      id,
      user_id: user.id,
    },
    select: {
      id: true,
    },
  });
};

const list = async (user: UserInfo, query: ListQuery) => {
  const { time, search, paid } = validate(listReceivableValidation, query);
  let filter: Prisma.ReceivableWhereInput = {};
  if (time) {
    isDateInvalid(time);
    const gte = new Date(time[0]).toISOString();
    const lte = new Date(time[1]).toISOString();
    filter = {
      AND: [
        {
          sale: {
            created_at: {
              gte,
            },
          },
        },
        {
          sale: {
            created_at: {
              lte,
            },
          },
        },
      ],
    };
  }
  if (search) {
    filter = {
      AND: [
        {
          OR: [
            { note: { contains: search } },
            { sale: { name: { contains: search } } },
            { sale: { category: { contains: search } } },
          ],
        },
        filter,
      ],
    };
  }
  if (paid != undefined) {
    filter = {
      AND: [
        {
          paid,
        },
        filter,
      ],
    };
  }
  return db.receivable.findMany({
    where: { AND: [{ user_id: user.id }, filter] },
    select: returnValue,
  });
};

export default { create, get, update, remove, list };
