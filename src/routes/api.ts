import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controllers/user-controller";
import { paramsMiddleware } from "../middleware/params-middleware";

const userRoute = Router();
userRoute.use(authMiddleware);
userRoute.use(paramsMiddleware);

userRoute.delete("/api/user/logout", userController.logout);
userRoute.get("/api/user/current", userController.get);
userRoute.patch("/api/user/current", userController.update);

export default userRoute;
