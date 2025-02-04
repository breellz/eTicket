import { Router } from "express";
import { eventRouter } from "./event.route";

export const apiRouter = Router();

apiRouter.use("/initialize", eventRouter)
