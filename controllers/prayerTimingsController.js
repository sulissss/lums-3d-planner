export async function getPrayerTimings(req, res, db, PRAYER_COLLECTION, connectToDb) {
  await connectToDb();
  const coll = db.collection(PRAYER_COLLECTION);
  let latest;
  try{
    latest = await coll.findOne({}, { sort: { updatedAt: -1 } });
  }
  catch(error){
    return res.status(501).json({ error: 'DB Error' });
  }
  try {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    if (latest && now - latest.updatedAt < oneDay) {
      return res.json(latest.timings);
    }

    const timings = await fetchPrayerTimingsFromSource();
    await coll.deleteMany({});
    await coll.insertOne({ timings, updatedAt: now });

    res.json(timings);  
  } catch (error) {
    if (latest) {
      return res.json(latest.timings);
    }
    res.status(500).json({ error: error.message });
  }
}
