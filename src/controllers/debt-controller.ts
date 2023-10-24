import { RouterHandler, params } from "../../interfaces/RouterHandler";
import { Debt, ListQuery } from "../../interfaces/Transaction";
import debtService from "../services/debt-service";

const create: RouterHandler<Promise<void>, {}, {}, Debt> = async (
  req,
  res,
  next
) => {
  try {
    const debt = await debtService.create(req.user, req.body);
    res.status(200).json({ data: debt });
  } catch (e) {
    next(e);
  }
};

const get: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const debt = await debtService.get(req.user, req.params.id);
    res.status(200).json({ data: debt });
  } catch (e) {
    next(e);
  }
};

const update: RouterHandler<Promise<void>, params, {}, Debt> = async (
  req,
  res,
  next
) => {
  try {
    const debt = await debtService.update(req.user, req.params.id, req.body);
    res.status(200).json({ data: debt });
  } catch (e) {
    next(e);
  }
};

const remove: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const debt = await debtService.remove(req.user, req.params.id);
    res.status(200).json({ data: debt });
  } catch (e) {
    next(e);
  }
};

const list: RouterHandler<Promise<void>, {}, {}, {}, ListQuery> = async (
  req,
  res,
  next
) => {
  try {
    const debt = await debtService.list(req.user, req.query);
    res.status(200).json({ data: debt });
  } catch (e) {
    next(e);
  }
};

export default { create, get, update, remove, list };
