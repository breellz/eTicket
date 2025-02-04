import { NextFunction, Request, Response } from 'express';
import { createEventValidation } from '../utils/helpers/validators/event-validators';
import AppError from '../utils/helpers/errorHandler';
import { sendErrorResponse, sendSuccessResponse } from '../utils/helpers/responseHandler';
import EventServices from "../services/event"

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {

  const { title, description, date, location, availableTickets } = req.body;

  const { error } = createEventValidation({ title, description, date, location, availableTickets });

  if (error) {

    return sendErrorResponse(res, error.message, 400);
  }
  try {
    // Create
    const event = await EventServices.createEvent({ title, description, date, location, availableTickets });

    return sendSuccessResponse(res, 'Event created successfully', 201, event);
  } catch (error) {
    next(new AppError('Failed to create event', 500));
  }
}