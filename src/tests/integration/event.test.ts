import supertest from "supertest";
import { main } from "../../app";
import datasource from "../../database/postgres";
import { clearDatabase, eventData, setUpDb, userData } from "../fixtures/setupDatabase";
import { Event } from "../../entities/event.entity";
import { User } from "../../entities/user.entity";
jest.setTimeout(300000);

let app: any

beforeAll(async () => {
  app = await main();
  await clearDatabase();
  await setUpDb();
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

  describe("Booking integration test", () => {
    it("book a new event", async () => {

      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[0].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/api/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toBe("Event booked successfully");
    })

    it("should return error if eventId is invalid", async () => {
      const userOne = userData[0];
      const response = await supertest(app).post(`/api/book/1000`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(404)
      expect(response.body.message).toBe("Event not found")
    })

    it("should return error if event is already booked by user", async () => {
      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[0].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/api/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('error')
      expect(response.body.statusCode).toBe(400)
      expect(response.body.message).toBe("Event already booked by user")
    })

    it(" should add to waitlist if no available tickets", async () => {
      const eventDatasource = datasource.getRepository(Event);
      const title = eventData[1].title;
      const event = await eventDatasource.findOne({ where: { title } });
      const userOne = userData[0];
      const eventId = event?.id;
      const response = await supertest(app).post(`/api/book/${eventId}`)
        .auth(`${userOne.username}`, `${userOne.password}`)
        .send()

      expect(response.body.status).toBe('success')
      expect(response.body.statusCode).toBe(200)
      expect(response.body.message).toBe("Added to waitlist")
    })

  })

})
