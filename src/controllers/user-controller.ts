import userService from "../services/user-service";
import { User } from "../../interfaces/User";
import { RouterHandler } from "../../interfaces/RouterHandler.d";

const register: RouterHandler<void> = async (req, res, next) => {
  try {
    const user = await userService.register(req);
    res.status(200).json({ data: user });
  } catch (e) {
    next(e);
  }
};

const login: RouterHandler<void> = async (req, res, next) => {
  try {
    const token = await userService.login(req);
    res.status(200).json({ data: token });
  } catch (e) {
    next(e);
  }
};

const logout: RouterHandler<void> = async (req, res, next) => {
  try {
    await userService.logout(req);
    res.status(200).json({ data: "logout" });
  } catch (e) {
    next(e);
  }
};

const get: RouterHandler<void> = async (req, res, next) => {
  try {
    const user: User = await userService.get(req.user.email);
    res.status(200).json({ data: user });
  } catch (e) {
    next(e);
  }
};

const update: RouterHandler<void> = async (req, res, next) => {
  try {
    const user: User = await userService.update(req.user.email, req.body);
    res.status(200).json({ data: user });
  } catch (e) {
    next(e);
  }
};
export default { register, login, logout, get, update };
