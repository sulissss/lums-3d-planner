import Office from '../models/Office.js';

export async function getAllOffices(req, res) {
  try {
    const offices = await Office.findAll();
    res.json(offices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getOfficeById(req, res) {
  try {
    const office = await Office.findById(req.params.id);
    office ? res.json(office) : res.status(404).json({ message: 'Office not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function createOffice(req, res) {
  try {
    const result = await Office.create(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateOffice(req, res) {
  try {
    const result = await Office.update(req.params.id, req.body);
    result.matchedCount
      ? res.json({ message: 'Office updated' })
      : res.status(404).json({ message: 'Office not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteOffice(req, res) {
  try {
    const result = await Office.delete(req.params.id);
    result.deletedCount
      ? res.json({ message: 'Office deleted' })
      : res.status(404).json({ message: 'Office not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
