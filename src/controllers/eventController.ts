import { Request, Response } from 'express';
import { Op } from 'sequelize';
import db from '../models';

export const createEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validStatuses = ['upcoming', 'ongoing', 'completed'];

  try {
    const {
      userId,
      name,
      description,
      eventDate,
      location,
      status = 'upcoming',
    } = req.body;

    if (!name || !eventDate) {
      return res.status(400).json({
        message: 'Name and Event Date are required fields',
      });
    }

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status value. Allowed values: ${validStatuses.join(
          ', '
        )}`,
      });
    }

    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newEvent = await db.Event.create({
      userId,
      name,
      description,
      eventDate,
      location,
      status,
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

export const getEvents = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const events = await db.Event.findAll({
      limit,
      attributes: [
        'id',
        'userId',
        'name',
        'description',
        'eventDate',
        'location',
        'mediaUrls',
        'status',
        'createdAt',
      ],
      where: {
        [Op.and]: [
          { status: { [Op.ne]: 'completed' } },
          { eventDate: { [Op.gte]: new Date() } },
        ],
      },
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['id', 'username', 'full_name', 'profile_picture'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    return res.status(200).json({
      message: 'Events fetched successfully',
      events,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      message: 'Failed to fetch events',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { eventId } = req.params;

  if (!eventId) {
    return res.status(400).json({ message: 'Event ID is required' });
  }

  try {
    const event = await db.Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await event.destroy();

    return res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    return res.status(500).json({
      message: 'Failed to delete event',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
