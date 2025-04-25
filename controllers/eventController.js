import Event from '../models/Event.js';

export async function getAllEvents(req, res) {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getEventById(req, res) {
  try {
    const event = await Event.findById(req.params.id);
    event ? res.json(event) : res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function createEvent(req, res) {
  try {
    const result = await Event.create(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateEvent(req, res) {
  try {
    const result = await Event.update(req.params.id, req.body);
    result.matchedCount
      ? res.json({ message: 'Event updated' })
      : res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteEvent(req, res) {
  try {
    const result = await Event.delete(req.params.id);
    result.deletedCount
      ? res.json({ message: 'Event deleted' })
      : res.status(404).json({ message: 'Event not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
