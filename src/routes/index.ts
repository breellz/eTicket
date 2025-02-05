import { Router } from "express";
import { eventRouter } from "./event.route";
import { bookingRouter } from "./booking.route";

export const apiRouter = Router();

apiRouter.use("/initialize", eventRouter)
apiRouter.use("/book", bookingRouter)
