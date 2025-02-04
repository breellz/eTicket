import { main } from "../../app";
import Postgres from "../../database/postgres";
import { clearDatabase } from "../fixtures/setupDatabase";

jest.setTimeout(30000);



let app: Express.Application;

beforeAll(async () => {
  app = await main();
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await Postgres.datasource.destroy();
});

describe("Authentication", () => {
  it("Should sign up a new user", async () => {

  })

});
