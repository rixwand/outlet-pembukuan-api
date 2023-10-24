import { Prisma } from "@prisma/client";
import { Debt, ListQuery } from "../../interfaces/Transaction";
import { UserInfo } from "../../interfaces/User";
import { db } from "../app/db";
import { ResponseError } from "../errors/response-error";
import {
  createDebtValidation,
  listDebtValidation,
  updateDebtValidation,
} from "../validation/debt-validation";
import { idValidation } from "../validation/user-validation";
import { validate } from "../validation/validation";
import { isDateInvalid } from "../helper/validation-helper";
import { isExpenseExist } from "./transaction-serivce";

const isDebtExist = async (user_id: number, debt_id: number) => {
  const count = await db.debt.count({
    where: {
      id: debt_id,
      user_id,
    },
  });
  if (count == 0) throw new ResponseError(404, "Debt not found");
};

const returnValue: Prisma.DebtSelect = {
  id: true,
  total: true,
  note: true,
  paid: true,
  created_at: true,
  expense: {
    select: {
      name: true,
      created_at: true,
    },
  },
};

const create = async (user: UserInfo, data: Debt & { expense_id?: number }) => {
  data = validate(createDebtValidation, data);
  if (data.expense_id) {
    const hasDebt = await isExpenseExist(user.id, data.expense_id);
    if (hasDebt) throw new ResponseError(409, "Expense already has debt");
  }
  return db.debt.create({
    data: {
      ...data,
      user_id: user.id,
    },
    select: returnValue,
  });
};

const get = async (user: UserInfo, id: number) => {
  id = validate(idValidation, id);
  await isDebtExist(user.id, id);
  return db.debt.findUnique({
    where: {
      id,
      user_id: user.id,
    },
    select: returnValue,
  });
};

const update = async (user: UserInfo, debt_id: number, data: Debt) => {
  debt_id = validate(idValidation, debt_id);
  data = validate(updateDebtValidation, data);
  await isDebtExist(user.id, debt_id);
  return db.debt.update({
    data,
    where: {
      id: debt_id,
      user_id: user.id,
    },
    select: returnValue,
  });
};

const remove = async (user: UserInfo, id: number) => {
  id = validate(idValidation, id);
  await isDebtExist(user.id, id);
  return db.debt.delete({
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
  const { time, search, paid } = validate(listDebtValidation, query);
  let filter: Prisma.DebtWhereInput = {};
  if (time) {
    isDateInvalid(time);
    const gte = new Date(time[0]).toISOString();
    const lte = new Date(time[1]).toISOString();
    filter = {
      AND: [
        {
          created_at: {
            gte,
          },
        },
        {
          created_at: {
            lte,
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
            { expense: { name: { contains: search } } },
          ],
        },
        filter,
      ],
    };
  }
  return db.debt.findMany({
    where: { AND: [{ user_id: user.id }, { paid }, filter] },
    select: returnValue,
  });
};

export default { create, get, update, remove, list };
