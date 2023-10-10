import { RouterHandler } from "../../interfaces/RouterHandler";
import tokenService from "../services/token-service";

const createAccessToken: RouterHandler<
  Promise<void>,
  {},
  {},
  { token: string }
> = async (req, res, next) => {
  try {
    const access_token = await tokenService.createAccessToken(req);
    res.status(200).json({ data: access_token });
  } catch (err) {
    next(err);
  }
};

export default { createAccessToken };
