
import express from "express";
import { bookEvent } from "../controller/booking.controller";
import { auth } from "../middleware/auth";

export const bookingRouter = express.Router();

bookingRouter.post("/:eventId", auth, bookEvent);
