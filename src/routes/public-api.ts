import { Router } from "express";
import userController from "../controllers/user-controller";
import tokenController from "../controllers/token-controller";

const publicRoute = Router();

publicRoute.post("/api/user/register", userController.register);
publicRoute.post("/api/user/login", userController.login);
publicRoute.post("/api/token", tokenController.createAccessToken);

export { publicRoute };
