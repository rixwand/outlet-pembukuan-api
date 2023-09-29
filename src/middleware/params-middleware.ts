import { RouterHandler } from "../../interfaces/RouterHandler";

export const paramsMiddleware: RouterHandler<void, { id: string | number }> = (
  req,
  res,
  next
) => {
  if (req.params && req.params.id && !isNaN(Number(req.params.id))) {
    req.params.id = parseInt(req.params.id as string);
  }
  next();
};
