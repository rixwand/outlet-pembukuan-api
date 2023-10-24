import { Router } from "express";
import { authMiddleware } from "../middleware/auth-middleware";
import userController from "../controllers/user-controller";
import { paramsMiddleware } from "../middleware/params-middleware";
import categoryController from "../controllers/category-controller";
import productController from "../controllers/product-controller";
import transactionController from "../controllers/transaction-controller";
import debtController from "../controllers/debt-controller";
import receivableController from "../controllers/receivable-controller";

const userRoute = Router();
userRoute.use(authMiddleware);

// user routes
userRoute.delete("/api/user/logout", userController.logout);
userRoute.get("/api/user/current", userController.get);
userRoute.patch("/api/user/current", userController.update);

// cateogry routes
userRoute.post("/api/category", categoryController.create);
userRoute.get("/api/category/list", categoryController.list);
userRoute.put("/api/category/:id", paramsMiddleware, categoryController.update);
userRoute.delete(
  "/api/category/:id",
  paramsMiddleware,
  categoryController.remove
);

// product routes
userRoute.post("/api/product", productController.create);
userRoute.get("/api/product/list", productController.list);
userRoute.get("/api/product/:id", paramsMiddleware, productController.get);
userRoute.patch("/api/product/:id", paramsMiddleware, productController.update);
userRoute.delete(
  "/api/product/:id",
  paramsMiddleware,
  productController.remove
);

// transaction routes
userRoute.post("/api/transaction/sale", transactionController.createSale);
userRoute.get(
  "/api/transaction/sale/:id",
  paramsMiddleware,
  transactionController.getSale
);
userRoute.delete(
  "/api/transaction/sale/:id",
  paramsMiddleware,
  transactionController.removeSale
);
userRoute.patch(
  "/api/transaction/sale/:id",
  paramsMiddleware,
  transactionController.updateSale
);
userRoute.post("/api/transaction/expense", transactionController.createExpense);
userRoute.get(
  "/api/transaction/expense/:id",
  paramsMiddleware,
  transactionController.getExpense
);
userRoute.delete(
  "/api/transaction/expense/:id",
  paramsMiddleware,
  transactionController.removeExpense
);
userRoute.patch(
  "/api/transaction/expense/:id",
  paramsMiddleware,
  transactionController.updateExpense
);
userRoute.get("/api/transaction", transactionController.listTransaction);

// debt transaction
userRoute.post("/api/debt", debtController.create);
userRoute.get("/api/debt/:id", paramsMiddleware, debtController.get);
userRoute.patch("/api/debt/:id", paramsMiddleware, debtController.update);
userRoute.delete("/api/debt/:id", paramsMiddleware, debtController.remove);
userRoute.get("/api/debt", debtController.list);

// receivable transaction
userRoute.post("/api/receivable", receivableController.create);
userRoute.get(
  "/api/receivable/:id",
  paramsMiddleware,
  receivableController.get
);
userRoute.patch(
  "/api/receivable/:id",
  paramsMiddleware,
  receivableController.update
);
userRoute.delete(
  "/api/receivable/:id",
  paramsMiddleware,
  receivableController.remove
);
userRoute.get("/api/receivable", receivableController.list);

export default userRoute;
