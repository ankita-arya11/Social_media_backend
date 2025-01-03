import { Request, Response } from 'express';
import db from '../models';

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id, name, description, eventDate, location } = req.body;

    if (!name || !eventDate) {
      return res.status(400).json({
        message: 'Name, startDate, and endDate are required fields',
      });
    }

    const newEvent = await db.Event.create({
      id,
      name,
      description,
      eventDate,
      location,
    });

    return res.status(201).json({
      message: 'Event created successfully',
      event: newEvent,
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      message: 'Failed to create event',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
