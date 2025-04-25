import { ObjectId } from 'mongodb';
import getDb from '../utils/db.js';

class Office {
  static async collection() {
    const db = await getDb();
    return db.collection('offices');
  }
  static async findAll() {
    const collection = await this.collection();
    return collection.find().toArray();
  }
  static async findById(id) {
    const collection = await this.collection();
    return collection.findOne({ _id: new ObjectId(id) });
  }
  static async create(data) {
    const collection = await this.collection();
    return collection.insertOne(data);
  }
  static async update(id, data) {
    const collection = await this.collection();
    return collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
  }
  static async delete(id) {
    const collection = await this.collection();
    return collection.deleteOne({ _id: new ObjectId(id) });
  }
}

export default Office;
