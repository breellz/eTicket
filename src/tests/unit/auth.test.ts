import { main } from "../../app";
import datasource from "../../database/postgres";
import { clearDatabase } from "../fixtures/setupDatabase";

jest.setTimeout(30000);



let app: Express.Application;

beforeAll(async () => {
  app = await main();
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await datasource.destroy();
});

describe("Authentication", () => {
  it("Should sign up a new user", async () => {

  })

});
