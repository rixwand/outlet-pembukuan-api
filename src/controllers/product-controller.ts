import { RouterHandler, params } from "../../interfaces/RouterHandler";
import productService from "../services/product-service";

const create: RouterHandler<Promise<void>> = async (req, res, next) => {
  try {
    const product = await productService.create(req);
    res.status(200).json({ data: product });
  } catch (e) {
    next(e);
  }
};

const list: RouterHandler<
  Promise<void>,
  {},
  {},
  {},
  { filter: [string]; search: string }
> = async (req, res, next) => {
  try {
    const product = await productService.list(req);
    res.status(200).json({ data: product });
  } catch (e) {
    next(e);
  }
};

const get: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const product = await productService.get(req);
    res.status(200).json({ data: product });
  } catch (e) {
    next(e);
  }
};

const update: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const product = await productService.update(req);
    res.status(200).json({ data: product });
  } catch (e) {
    next(e);
  }
};

const remove: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const product = await productService.remove(req);
    res.status(200).json({ data: product });
  } catch (e) {
    next(e);
  }
};
export default { create, list, get, remove, update };
