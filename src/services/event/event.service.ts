import datasource from "../../database/postgres"
import { ICreateEventData } from "../../utils/helpers/validators/event-validators"
import { Event } from "../../entities/event.entity"
import { User } from "../../entities/user.entity"
import { Booking } from "../../entities/bookings.entity"
import { WaitList } from "../../entities/waitList.entity"

export const createEvent = async (data: ICreateEventData) => {
  try {

    const eventReposiotry = datasource.getRepository(Event)

    const event = eventReposiotry.create(data)
    await eventReposiotry.save(event)
    return event
  } catch (error) {
    throw error
  }
}

export const getEventById = async (eventId: number) => {
  try {
    const eventRepository = datasource.getRepository(Event)
    const event = await eventRepository.findOne({ where: { id: eventId } })

    return event
  } catch (error) {
    throw error
  }
}

export const addToWaitList = async (userId: number, eventId: number) => {
  try {
    const userRepository = datasource.getRepository(User)
    const eventRepository = datasource.getRepository(Event)
    const waitListRepository = datasource.getRepository(WaitList)

    const user = await userRepository.findOne({ where: { id: userId } })
    const event = await eventRepository.findOne({ where: { id: eventId } })

    if (!user || !event) {
      throw new Error("User or event not found")
    }

    const maxOrder = await waitListRepository
      .createQueryBuilder("waitlist")
      .where("waitlist.eventId = :eventId", { eventId })
      .select("MAX(waitlist.order)", "max")
      .getRawOne();

    const newOrder = (maxOrder?.max || 0) + 1;

    const waitList = waitListRepository.create({ user, event, order: newOrder })
    await waitListRepository.save(waitList)

    return { message: "Added to waitlist" }
  } catch (error) {
    throw error
  }
}

//to ensure thread safety and handle racs conditions, 
// I made booking transactional and locked the databse until the current transaction is completed
export const bookEvent = async (userId: number, eventId: number) => {
  const entityManager = datasource.createEntityManager();

  return await entityManager.transaction(async transactionalEntityManager => {
    const userRepository = transactionalEntityManager.getRepository(User);
    const eventRepository = transactionalEntityManager.getRepository(Event);
    const bookingRepository = transactionalEntityManager.getRepository(Booking);

    const user = await userRepository.findOne({ where: { id: userId } });
    const event = await eventRepository.findOne({ where: { id: eventId }, lock: { mode: 'pessimistic_write' } });

    if (!user || !event) {
      throw new Error("User or event not found");
    }

    if (event.availableTickets <= 0) {
      throw new Error("No available tickets");
    }

    const existingBooking = await bookingRepository.findOne({
      where: {
        event: { id: eventId },
        user: { id: userId }
      }
    });

    if (existingBooking) {
      throw new Error("Event already booked by user");
    }

    const booking = bookingRepository.create({ user, event });
    await bookingRepository.save(booking);

    event.availableTickets -= 1;
    await eventRepository.save(event);

    return { message: "Event booked successfully" };
  });
};

export const isEventBookedByUser = async (userId: number, eventId: number) => {
  try {
    const bookingRepository = datasource.getRepository(Booking)
    const booking = await bookingRepository.findOne({
      where: {
        event: {
          id: eventId
        },
        user: {
          id: userId
        }
      }
    })

    return booking ? true : false
  } catch (error) {
    throw error
  }
}