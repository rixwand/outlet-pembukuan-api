import { RouterHandler, params } from "../../interfaces/RouterHandler";
import { Receivable, ListQuery } from "../../interfaces/Transaction";
import receivableService from "../services/receivable-service";

const create: RouterHandler<
  Promise<void>,
  {},
  {},
  Receivable & { sale_id: number }
> = async (req, res, next) => {
  try {
    const receivable = await receivableService.create(req.user, req.body);
    res.status(200).json({ data: receivable });
  } catch (e) {
    next(e);
  }
};

const get: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const receivable = await receivableService.get(req.user, req.params.id);
    res.status(200).json({ data: receivable });
  } catch (e) {
    next(e);
  }
};

const update: RouterHandler<Promise<void>, params, {}, Receivable> = async (
  req,
  res,
  next
) => {
  try {
    const receivable = await receivableService.update(
      req.user,
      req.params.id,
      req.body
    );
    res.status(200).json({ data: receivable });
  } catch (e) {
    next(e);
  }
};

const remove: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const receivable = await receivableService.remove(req.user, req.params.id);
    res.status(200).json({ data: receivable });
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
    const receivable = await receivableService.list(req.user, req.query);
    res.status(200).json({ data: receivable });
  } catch (e) {
    next(e);
  }
};

export default { create, get, update, remove, list };
