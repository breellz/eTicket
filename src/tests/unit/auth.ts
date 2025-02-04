import { main } from "../../app";
import datasource from "../../database/postgres";
import { clearDatabase } from "../fixtures/setupDatabase";
import { createEvent } from "../../controller/event.controller";
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

describe("Create Event test", () => {
  it("Should create a new event", async () => {

  })

});
