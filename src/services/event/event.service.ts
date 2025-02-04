import datasource from "../../database/postgres"
import { ICreateEventData } from "../../utils/helpers/validators/event-validators"
import { Event } from "../../entities/event.entity"

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