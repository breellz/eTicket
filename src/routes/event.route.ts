
import express from "express";
import { createEvent } from "../controller/event.controller";

export const eventRouter = express.Router();

eventRouter.post("/", createEvent);
