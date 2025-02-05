import express, { Request, Response } from "express";
import "dotenv/config";
import datasource from "./database/postgres";
import { apiRouter } from "./routes";
import { errorHandler } from './utils/helpers/errorHandler';
import { populateDB } from "./utils/helpers/setup-database";

export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();
    await datasource.initialize();
    await populateDB()
    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
      res.send("eTicket api online");
    })

    app.use("/api", apiRouter);
    app.use(errorHandler)

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
