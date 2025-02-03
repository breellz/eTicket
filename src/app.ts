import express, { Request, Response } from "express";
import Postgres from "./database/postgres";
import "dotenv/config";


export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();

    await Postgres.connect();

    app.get("/", (req: Request, res: Response) => {
      res.send("eTicket database online");
    })

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
