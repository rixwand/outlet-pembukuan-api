import { Request } from "express";
import { validate } from "../validation/validation";
import {
  createExpenseValidation,
  createSaleValidation,
  listTransactionValdiation,
  updateExpenseValidation,
  updateSaleValidation,
} from "../validation/transaction-validation";
import { Expense, Sale } from "../../interfaces/Transaction";
import { ResponseError } from "../errors/response-error";
import { db } from "../app/db";
import { params } from "../../interfaces/RouterHandler";
import { idValidation } from "../validation/user-validation";
import {
  Prisma,
  Sale as prismaSale,
  Expense as prismaExpense,
} from "prisma/prisma-client";
import { user_id } from "../../interfaces/Product";

const isSaleExist = async (user_id: number, sale_id: number) => {
  const count = await db.sale.count({
    where: {
      id: sale_id,
      user_id,
    },
  });
  if (count == 0) throw new ResponseError(404, "Transaction not found");
};

const isExpenseExist = async (user_id: number, expens_id: number) => {
  const count = await db.expense.count({
    where: {
      id: expens_id,
      user_id,
    },
  });
  if (count == 0) throw new ResponseError(404, "Transaction not found");
};

const isDateInvalid = (dates: Date[]) => {
  dates.forEach((date) => {
    if (isNaN(new Date(date).getTime()))
      throw new ResponseError(422, "query parameter time is invalid");
  });
};
const createSale = async (req: Request) => {
  const sale: Sale = validate(createSaleValidation, req.body);
  const user_id = req.user.id;
  sale.user_id = user_id;
  const productSale = await db.sale.create({
    data: sale as any,
    select: {
      id: true,
      name: true,
      category: true,
      basic_price: true,
      selling_price: true,
      created_at: true,
    },
  });
  return { ...productSale, type: "sale" };
};

const getSale = async (req: Request<params>) => {
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isSaleExist(user_id, sale_id);
  const sale = await db.sale.findUnique({
    where: {
      id: sale_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
      category: true,
      basic_price: true,
      selling_price: true,
      receivable: true,
      created_at: true,
    },
  });
  return { ...sale, type: "sale" };
};

const createExpense = async (req: Request<{}, {}, Expense>) => {
  const expense = validate(createExpenseValidation, req.body);
  expense.user_id = req.user.id;
  const result = await db.expense.create({
    data: expense as any,
    select: {
      id: true,
      name: true,
      debt: true,
      total: true,
    },
  });
  return { ...result, type: "expense" };
};

const getExpense = async (req: Request<params>) => {
  const expense_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isExpenseExist(user_id, expense_id);
  return db.expense.findUnique({
    where: {
      id: expense_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
      total: true,
      debt: true,
      created_at: true,
    },
  });
};

const updateSale = async (req: Request<params, {}, Sale>) => {
  const saleUpdate = validate(updateSaleValidation, req.body);
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isSaleExist(user_id, sale_id);
  saleUpdate.user_id = user_id;
  const sale = await db.sale.update({
    data: saleUpdate,
    where: {
      id: sale_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
      category: true,
      basic_price: true,
      selling_price: true,
      receivable: true,
      created_at: true,
    },
  });
  return { ...sale, type: "sale" };
};

const updateExpense = async (req: Request<params, {}, Expense>) => {
  const expenseUpdate = validate(updateExpenseValidation, req.body);
  const expense_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isExpenseExist(user_id, expense_id);
  const expense = await db.expense.update({
    data: expenseUpdate,
    where: {
      id: expense_id,
      user_id,
    },
    select: {
      id: true,
      name: true,
      total: true,
      debt: true,
      created_at: true,
    },
  });
  return { ...expense, type: "expense" };
};

const removeSale = async (req: Request<params>) => {
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isSaleExist(user_id, sale_id);
  return db.sale.delete({
    where: {
      id: sale_id,
      user_id,
    },
    select: { id: true },
  });
};

const removeExpense = async (req: Request<params>) => {
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  await isExpenseExist(user_id, sale_id);
  return db.expense.delete({
    where: {
      id: sale_id,
      user_id,
    },
    select: { id: true },
  });
};

const listTransaction = async (
  req: Request<
    {},
    {},
    {},
    {
      search: string;
      type: string;
      debt: boolean;
      receivable: boolean;
      time: Array<Date>;
    }
  >
) => {
  console.log(req.query.time);
  const { search, type, time, debt, receivable } = validate(
    listTransactionValdiation,
    req.query
  );
  let filter: Prisma.SaleWhereInput | Prisma.ExpenseWhereInput = {};
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
  } else {
    const today = new Date();
    filter.created_at = {
      gte: new Date(today.toLocaleDateString()).toISOString(),
    };
  }

  let transaction: Array<Sale<user_id> | Expense<user_id>> = new Array();
  if (!type || type == "sale") {
    let saleFilter = { ...filter };
    if (search) {
      saleFilter = {
        AND: [
          {
            OR: [
              { category: { contains: search } },
              { name: { contains: search } },
            ],
          },
          filter as Prisma.SaleWhereInput,
        ],
      };
    }
    if (receivable != undefined) {
      saleFilter = {
        AND: [
          { receivable },
          { AND: saleFilter.AND as Prisma.SaleWhereInput[] },
        ],
      };
    }
    const sales: Sale<user_id>[] = await db.sale.findMany({
      where: saleFilter as Prisma.SaleWhereInput,
      select: {
        id: true,
        name: true,
        category: true,
        receivable: true,
        basic_price: true,
        selling_price: true,
        created_at: true,
      },
    });
    transaction.push(...sales);
  }
  if (!type || type == "expense") {
    let expenseFilter = { ...filter };
    if (search) {
      expenseFilter = {
        AND: [
          { name: { contains: search } },
          filter as Prisma.ExpenseWhereInput,
        ],
      };
    }
    if (debt != undefined) {
      expenseFilter = {
        AND: [{ debt }, { AND: filter.AND as Prisma.ExpenseWhereInput }],
      };
    }
    const expenses: Expense<user_id>[] = await db.expense.findMany({
      where: expenseFilter as Prisma.ExpenseWhereInput,
      select: {
        id: true,
        name: true,
        total: true,
        debt: true,
        created_at: true,
      },
    });
    transaction.push(...expenses);
  }
  return transaction;
};

export default {
  createSale,
  getSale,
  createExpense,
  getExpense,
  updateSale,
  updateExpense,
  removeExpense,
  removeSale,
  listTransaction,
};
