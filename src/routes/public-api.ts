import { Router } from "express";
import userController from "../controllers/user-controller";

const publicRoute = Router();

publicRoute.post("/api/user/register", userController.register);
publicRoute.post("/api/user/login", userController.login);

export { publicRoute };
