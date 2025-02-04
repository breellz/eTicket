import express, { Request, Response } from "express";
import "dotenv/config";
import datasource from "./database/postgres";


export const main = async (): Promise<express.Application> => {
  try {
    const app: express.Application = express();

    await datasource.initialize();

    app.get("/", (req: Request, res: Response) => {
      res.send("eTicket database online");
    })

    return app;
  } catch (error) {
    console.error(error);
    throw new Error("Unable to connect to database");
  }
}
