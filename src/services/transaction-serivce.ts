import { Request } from "express";
import { validate } from "../validation/validation";
import {
  createExpenseValidation,
  createSaleValidation,
  listTransactionValdiation,
  updateExpenseValidation,
  updateSaleValidation,
} from "../validation/transaction-validation";
import { Debt, Expense, Receivable, Sale } from "../../interfaces/Transaction";
import { ResponseError } from "../errors/response-error";
import { db } from "../app/db";
import { params } from "../../interfaces/RouterHandler";
import { idValidation } from "../validation/user-validation";
import { Prisma } from "prisma/prisma-client";
import { user_id } from "../../interfaces/Product";
import { isDateInvalid } from "../helper/validation-helper";
import days from "../app/time";

const returnValue: Prisma.SaleSelect = {
  id: true,
  name: true,
  category: true,
  basic_price: true,
  selling_price: true,
  created_at: true,
  receivable: {
    select: {
      total: true,
      note: true,
      paid: true,
    },
  },
};

const expenseReturnValue: Prisma.ExpenseSelect = {
  id: true,
  name: true,
  total: true,
  debt: {
    select: {
      total: true,
      note: true,
      paid: true,
    },
  },
  created_at: true,
};

export const isSaleExist = async (user_id: number, sale_id: number) => {
  const count = await db.sale.findFirst({
    where: {
      id: sale_id,
      user_id,
    },
    select: {
      receivable: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!count) throw new ResponseError(404, "Transaction not found");
  return count.receivable;
};

export const isExpenseExist = async (user_id: number, expens_id: number) => {
  const count = await db.expense.findFirst({
    where: {
      id: expens_id,
      user_id,
    },
    select: {
      debt: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!count) throw new ResponseError(404, "Transaction not found");
  return count.debt;
};

// Sale Transaction
const createSale = async (req: Request) => {
  const { receivable, ...sale } = validate(createSaleValidation, req.body);
  const user_id = req.user.id;
  sale.user_id = user_id;
  const createSale = await db.sale.create({
    data: sale as any,
    select: {
      id: true,
    },
  });
  if (receivable) {
    await db.receivable.create({
      data: {
        ...receivable,
        user_id,
        sale_id: createSale.id,
      },
    });
  }
  const productSale = await db.sale.findUnique({
    where: {
      id: createSale.id,
      user_id,
    },
    select: returnValue,
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
    select: returnValue,
  });
  return { ...sale, type: "sale" };
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
    select: returnValue,
  });
  return { ...sale, type: "sale" };
};

const removeSale = async (req: Request<params>) => {
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  const hasReceivable = await isSaleExist(user_id, sale_id);
  if (hasReceivable) {
    await db.receivable.delete({
      where: {
        id: hasReceivable?.id,
        user_id,
      },
    });
  }
  return db.sale.delete({
    where: {
      id: sale_id,
      user_id,
    },
    select: { id: true },
  });
};

// Expense transaction
const createExpense = async (
  req: Request<{}, {}, Expense<undefined, Debt>>
) => {
  const { debt, ...expense } = validate(createExpenseValidation, req.body);
  const user_id = req.user.id;
  expense.user_id = user_id;
  const resultExpense = await db.expense.create({
    data: expense as any,
    select: {
      id: true,
    },
  });
  if (debt) {
    await db.debt.create({
      data: {
        ...debt,
        user_id,
        expense_id: resultExpense.id,
      },
    });
  }

  const result = await db.expense.findUnique({
    where: {
      id: resultExpense.id,
      user_id,
    },
    select: expenseReturnValue,
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
    select: expenseReturnValue,
  });
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
    select: expenseReturnValue,
  });
  return { ...expense, type: "expense" };
};

const removeExpense = async (req: Request<params>) => {
  const sale_id = validate(idValidation, req.params.id);
  const user_id = req.user.id;
  const hasDebt = await isExpenseExist(user_id, sale_id);
  if (hasDebt) {
    await db.debt.delete({
      where: {
        id: hasDebt?.id,
        user_id,
      },
    });
  }
  return db.expense.delete({
    where: {
      id: sale_id,
      user_id,
    },
    select: { id: true },
  });
};

// List transaction
const listTransaction = async (
  req: Request<
    {},
    {},
    {},
    {
      search: string;
      type: string;
      time: Array<Date>;
    }
  >
) => {
  console.log(req.query.time);
  const { search, type, time } = validate(listTransactionValdiation, req.query);
  let filter: Prisma.SaleWhereInput | Prisma.ExpenseWhereInput = {};
  if (time) {
    isDateInvalid(time);
    const gte = days(time[0], "DD-MM-YYYY").toISOString();
    const lte = days(time[1], "DD-MM-YYYY").toISOString();
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
    filter.created_at = {
      gte: days().startOf("day").toISOString(),
      lte: days().endOf("day").toISOString(),
    };
  }

  let transaction = new Array();

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
    let sales: Array<Sale<user_id, Receivable | null>> = await db.sale.findMany(
      {
        where: saleFilter as Prisma.SaleWhereInput,
        select: returnValue,
      }
    );
    sales = sales.map((sale: Sale<user_id, Receivable | null>) => {
      return { ...sale, type: "sale" };
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
    let expenses: Expense<user_id, Debt | null>[] = await db.expense.findMany({
      where: expenseFilter as Prisma.ExpenseWhereInput,
      select: expenseReturnValue,
    });
    expenses = expenses.map((expense: Expense<user_id, Debt | null>) => {
      return { ...expense, type: "expense" };
    });
    transaction.push(...expenses);
  }
  if (transaction.length === 0)
    throw new ResponseError(404, "Transaction not found");
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
