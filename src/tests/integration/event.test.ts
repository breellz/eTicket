import { main } from "../../app";
import datasource from "../../database/postgres";
import { clearDatabase } from "../fixtures/setupDatabase";
import { createEvent } from "../../controller/event.controller";
import supertest from "supertest";
import { Server } from "http";

jest.setTimeout(30000);



let app: any

beforeAll(async () => {
  app = await main();
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await datasource.destroy();
});

describe("Event integration test", () => {
  it("Should create a new event", async () => {
    const response = await supertest(app).post("/api/initialize").send({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-10-10",
      location: "Lagos",
      availableTickets: 100,
    });
    expect(response.body.status).toBe("success");
    expect(response.body.statusCode).toBe(201);
    expect(response.body.message).toBe("Event created successfully");
    expect(response.body).toHaveProperty("data");
  })

  it("Should return an error if the event data is invalid", async () => {
    const response = await supertest(app).post("/api/initialize").send({
      title: "Test Event",
      description: "This is a test event",
      date: "2025-10-10",
      location: "Lagos",
    });

    expect(response.body.status).toBe("error");
    expect(response.body.statusCode).toBe(400);
    expect(response.body.message).toBe("\"availableTickets\" is required");
  })

});
