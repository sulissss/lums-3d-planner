import User from '../models/User.js';

export async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    user ? res.json(user) : res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function createUser(req, res) {
  try {
    const result = await User.create(req.body);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function updateUser(req, res) {
  try {
    const result = await User.update(req.params.id, req.body);
    result.matchedCount
      ? res.json({ message: 'User updated' })
      : res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export async function deleteUser(req, res) {
  try {
    const result = await User.delete(req.params.id);
    result.deletedCount
      ? res.json({ message: 'User deleted' })
      : res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
