import express from "express";
import { errorMiddleware } from "../middleware/error-middleware";
import { publicRoute } from "../routes/public-api";
import userRoute from "../routes/api";

const web = express();

web.use(express.json());
web.use(publicRoute);
web.use(userRoute);

web.use(errorMiddleware);

export default web;
