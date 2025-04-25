import Eatery from '../models/Eatery.js';

export async function getAllEateries(req, res) {
  try {
    const eateries = await Eatery.findAll();
    res.json(eateries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getEateryById(req, res) {
  try {
    const eatery = await Eatery.findById(req.params.id);
    eatery ? res.json(eatery) : res.status(404).json({ message: 'Eatery not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function createEatery(req, res) {
  try {
    const result = await Eatery.create(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateEatery(req, res) {
  try {
    const result = await Eatery.update(req.params.id, req.body);
    result.matchedCount
      ? res.json({ message: 'Eatery updated' })
      : res.status(404).json({ message: 'Eatery not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteEatery(req, res) {
  try {
    const result = await Eatery.delete(req.params.id);
    result.deletedCount
      ? res.json({ message: 'Eatery deleted' })
      : res.status(404).json({ message: 'Eatery not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
