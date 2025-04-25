export async function getPrayerTimings(req, res, db, PRAYER_COLLECTION, connectToDb) {
  await connectToDb();
  const coll = db.collection(PRAYER_COLLECTION);
  let latest;
  try{
    latest = await coll.findOne({}, { sort: { updatedAt: -1 } });
  }
  catch(error){
    console.log("error fetching db");
    return res.status(501).json({ error: 'DB Error' });
  }
  try {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    if (latest && now - latest.updatedAt < oneDay) {
      // Return cached data
      return res.json(latest.timings);
    }

    // Fetch fresh data
    const timings = await fetchPrayerTimingsFromSource();

    // Update DB (clear old or upsert)
    await coll.deleteMany({});
    await coll.insertOne({ timings, updatedAt: now });

    res.json(timings);
  } catch (error) {
    console.error('Error fetching prayer timings:', error);
    // Fallback: if cache exists, return it
    if (latest) {
      return res.json(latest.timings);
    }
    res.status(500).json({ error: error.message });
  }
}
