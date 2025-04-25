import Location from '../models/Location.js';

export async function getAllLocations(req, res) {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getLocationById(req, res) {
  try {
    const location = await Location.findById(req.params.id);
    location ? res.json(location) : res.status(404).json({ message: 'Location not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function createLocation(req, res) {
  try {
    const result = await Location.create(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateLocation(req, res) {
  try {
    const result = await Location.update(req.params.id, req.body);
    result.matchedCount
      ? res.json({ message: 'Location updated' })
      : res.status(404).json({ message: 'Location not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteLocation(req, res) {
  try {
    const result = await Location.delete(req.params.id);
    result.deletedCount
      ? res.json({ message: 'Location deleted' })
      : res.status(404).json({ message: 'Location not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
