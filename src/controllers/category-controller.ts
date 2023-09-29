import { RouterHandler, params } from "../../interfaces/RouterHandler";
import categoryService from "../services/category-service";

const create: RouterHandler<Promise<void>> = async (req, res, next) => {
  try {
    const categeory = await categoryService.create(req);
    res.status(200).json({ data: categeory });
  } catch (e) {
    next(e);
  }
};

const list: RouterHandler<Promise<void>> = async (req, res, next) => {
  try {
    const categeory = await categoryService.list(req);
    res.status(200).json({ data: categeory });
  } catch (e) {
    next(e);
  }
};

const update: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const categeory = await categoryService.update(req);
    res.status(200).json({ data: categeory });
  } catch (e) {
    next(e);
  }
};

const remove: RouterHandler<Promise<void>, params> = async (req, res, next) => {
  try {
    const categeory_id = await categoryService.remove(req);
    res.status(200).json({ data: categeory_id });
  } catch (e) {
    next(e);
  }
};

export default { create, list, update, remove };
