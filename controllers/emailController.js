import getDb from '../utils/db.js';
import processEmail from '../utils/emailFilter.js';

export async function processEmails(req, res) {
  const emails = req.body;
  if (!Array.isArray(emails)) {
    return res.status(400).json({ error: 'Invalid request body. Expected an array of emails.' });
  }
  try {
    const processedEvents = await processEmail(emails);
    if (Array.isArray(processedEvents)) {
      const db = await getDb();
      const eventsCollection = db.collection('events');

      const uniqueEvents = [];
      for (const event of processedEvents) {
        const exists = await eventsCollection.findOne({
          eventName: event.eventName,
          eventDescription: event.eventDescription,
          eventDate: event.eventDate,
          eventTime: event.eventTime,
          eventLocationID: event.eventLocationID
        });
        if (!exists) {
          uniqueEvents.push(event);
        }
      }
      let insertedCount = 0;
      if (uniqueEvents.length > 0) {
        const insertResult = await eventsCollection.insertMany(uniqueEvents);
        insertedCount = insertResult.insertedCount || uniqueEvents.length;
      }
      res.status(201).json({ message: `Successfully processed ${emails.length} emails and added ${insertedCount} unique events.` });
    } else {
      res.status(500).json({ error: 'Invalid response format from email_filter.js. Expected an array.' });
    }
  } catch (error) {
    console.error('Error processing emails:', error.message);
    res.status(500).json({ error: `Failed to process emails: ${error.message}` });
  }
};
