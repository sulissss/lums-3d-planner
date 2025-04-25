import express from 'express';
import cheerio from 'cheerio';

const router = express.Router();

const LATITUDE = 31.469532529069962;
const LONGITUDE = 74.40934493320935;

function getStaticPrayerTimings(month, date) {
  switch (month) {
    case 1:  return date <= 15 ? { fajar: "6:20am", asar: "4:00pm", isha: "7:15pm" } : { fajar: "6:20am", asar: "4:15pm", isha: "7:15pm" };
    case 2:  return date <= 15 ? { fajar: "6:10am", asar: "4:30pm", isha: "7:30pm" } : { fajar: "6:00am", asar: "4:45pm", isha: "7:45pm" };
    case 3:  return date <= 15 ? { fajar: "5:40am", asar: "4:45pm", isha: "8:00pm" } : { fajar: "5:20am", asar: "5:00pm", isha: "8:00pm" };
    case 4:  return date <= 15 ? { fajar: "5:00am", asar: "5:00pm", isha: "8:15pm" } : { fajar: "4:40am", asar: "5:15pm", isha: "8:30pm" };
    case 5:  return date <= 15 ? { fajar: "4:30am", asar: "5:15pm", isha: "8:45pm" } : { fajar: "4:20am", asar: "5:15pm", isha: "9:00pm" };
    case 6:  return { fajar: "4:20am", asar: "5:30pm", isha: "9:15pm" };
    case 7:  return date <= 15 ? { fajar: "4:30am", asar: "5:30pm", isha: "9:15pm" } : { fajar: "4:30am", asar: "5:30pm", isha: "9:00pm" };
    case 8:  return date <= 15 ? { fajar: "4:40am", asar: "5:15pm", isha: "9:00pm" } : { fajar: "4:50am", asar: "5:15pm", isha: "8:30pm" };
    case 9:  return date <= 15 ? { fajar: "5:00am", asar: "5:00pm", isha: "8:15pm" } : { fajar: "5:10am", asar: "4:45pm", isha: "7:45pm" };
    case 10: return date <= 15 ? { fajar: "5:20am", asar: "4:30pm", isha: "7:30pm" } : { fajar: "5:30am", asar: "4:15pm", isha: "7:15pm" };
    case 11: return date <= 15 ? { fajar: "5:40am", asar: "4:00pm", isha: "7:00pm" } : { fajar: "6:00am", asar: "3:45pm", isha: "7:00pm" };
    case 12: return date <= 15 ? { fajar: "6:10am", asar: "3:45pm", isha: "7:00pm" } : { fajar: "6:20am", asar: "4:00pm", isha: "7:00pm" };
    default: throw new Error(`Unexpected month: ${month}`);
  }
}

async function fetchSunriseSunset(now, fetch) {
  const isoDate = now.toISOString().split("T")[0];
  const url = `https://api.sunrise-sunset.org/json?lat=${LATITUDE}&lng=${LONGITUDE}&date=${isoDate}&formatted=0`;
  const resp = await fetch(url);
  const json = await resp.json();
  const sunset = new Date(json.results.sunset);
  sunset.setMinutes(sunset.getMinutes() + 1);
  let maghrib = sunset.toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
  let sunrise = new Date(json.results.sunrise).toLocaleTimeString("en-US", { hour12: true, hour: "2-digit", minute: "2-digit" });
  sunrise = sunrise.split(" ")[0] + sunrise.split(" ")[1].toLowerCase();
  maghrib = maghrib.split(" ")[0] + maghrib.split(" ")[1].toLowerCase();
  return { sunrise, maghrib };
}

function parseZuhrFromHtml(html) {
  const $ = cheerio.load(html);
  let zuhr;
  $('.row.schedule-item').each((i, el) => {
    const label = $(el).find('time').text().trim();
    if (label === 'Zuhr') {
      zuhr = $(el).find('.col-md-10 h4').text().trim();
      return false;
    }
  });
  return zuhr;
}

router.get('/', async (req, res) => {
  try {
    const fetch = global.fetch || (await import('node-fetch')).default;
    const htmlResp = await fetch('https://lrs.lums.edu.pk/namazTimings.html');
    const html = await htmlResp.text();
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const { fajar, asar, isha } = getStaticPrayerTimings(month, date);
    const { sunrise, maghrib } = await fetchSunriseSunset(now, fetch);
    const zuhr = parseZuhrFromHtml(html);
    const jumma = "1:30pm";
    res.json({ fajar, zuhr, asar, isha, maghrib, sunrise, jumma });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
