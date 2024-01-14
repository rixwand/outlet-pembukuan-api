import { RouterHandler, params } from "../../interfaces/RouterHandler";
import transactionSerivce from "../services/transaction-serivce";
import { user_id } from "../../interfaces/Product";
import { Sale, Expense, Receivable } from "../../interfaces/Transaction";

const createExpense: RouterHandler<
  Promise<void>,
  {},
  {},
  Expense<undefined, Receivable>
> = async (req, res, next) => {
  try {
    const expenses = await transactionSerivce.createExpense(req);
    res.status(200).json({ data: expenses });
  } catch (e) {
    next(e);
  }
};

const createSale: RouterHandler<Promise<void>> = async (req, res, next) => {
  try {
    const sales = await transactionSerivce.createSale(req);
    res.status(200).json({ data: sales });
  } catch (e) {
    next(e);
  }
};

const getSale: RouterHandler<Promise<void>, params> = async (
  req,
  res,
  next
) => {
  try {
    const sale = await transactionSerivce.getSale(req);
    res.status(200).json({ data: sale });
  } catch (e) {
    next(e);
  }
};

const removeSale: RouterHandler<Promise<void>, params> = async (
  req,
  res,
  next
) => {
  try {
    const sale = await transactionSerivce.removeSale(req);
    res.status(200).json({ data: sale });
  } catch (e) {
    next(e);
  }
};

const updateSale: RouterHandler<Promise<void>, params, {}, Sale> = async (
  req,
  res,
  next
) => {
  try {
    const sale = await transactionSerivce.updateSale(req);
    res.status(200).json({ data: sale });
  } catch (e) {
    next(e);
  }
};

const getExpense: RouterHandler<Promise<void>, params> = async (
  req,
  res,
  next
) => {
  try {
    const expense = await transactionSerivce.getExpense(req);
    res.status(200).json({ data: expense });
  } catch (e) {
    next(e);
  }
};

const removeExpense: RouterHandler<Promise<void>, params> = async (
  req,
  res,
  next
) => {
  try {
    const expense = await transactionSerivce.removeExpense(req);
    res.status(200).json({ data: expense });
  } catch (e) {
    next(e);
  }
};

const updateExpense: RouterHandler<Promise<void>, params, {}, Expense> = async (
  req,
  res,
  next
) => {
  try {
    const expense = await transactionSerivce.updateExpense(req);
    res.status(200).json({ data: expense });
  } catch (e) {
    next(e);
  }
};

const listTransaction: RouterHandler<
  Promise<void>,
  {},
  {},
  {},
  {
    search: string;
    type: string;
    time: Array<Date>;
    debt: boolean;
    receivable: boolean;
  }
> = async (req, res, next) => {
  try {
    const transactions = await transactionSerivce.listTransaction(req);
    res.status(200).json({ data: transactions });
  } catch (e) {
    next(e);
  }
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
