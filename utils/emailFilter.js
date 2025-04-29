import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

export default async function processEmail(emailContent) {

    const getCurrentDate = () => {
        const today = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }

    const locationMap = {
        'Syed Babar Ali School of Science and Engineering (SBASSE)': 1,
        'Suleman Dawood School of Business (SDSB)': 2,
        'Syed Ahsan Ali and Syed Maratib Ali School of Education / The Gad and Birgit Rausing Library / Information Systems and Technology (IST) Lab': 3,
        'Shaikh Ahmad Hassan School of Law (SAHSOL)': 4,
        'Academic Block / Mushtaq Ahmad Gurmani School of Humanities and Social Sciences (MGSHSS) / LUMS Learning Institute (LLI)': 5,
        'Khoka / Pepsi Dining Centre (PDC)': 6,
        'Community Mosque': 7,
        'Syed Maratab Ali Sports Complex': 8,
        'Coca-Cola Aquatic Centre': 9,
        'Rausing Executive Development Centre (REDC)': 10,
        'Male Hostels / M1 / M2 / M3 / M4 / M5 / M6 / M7': 11,
        'Female Hostels / F1 / F2 / F3 / F4 / F5 / F6': 12
      }

    const lums_locations = JSON.stringify(Object.keys(locationMap))

    const prompt = `You are an email information extractor for the university of LUMS. I'll give you an email (it may or may not be about an event), and your goal is to do either of the following:
    - If the email is about an event, then return the:
        -- eventName
        -- eventLocation
            --- Based on your knowledge of the university of LUMS, return a value from either of the following where you believe the event is going to be held:
            ${lums_locations}
            --- If you don't think that the location described in the event corresponds to any of the afore-mentioned locations, then return null for this field.
        -- eventDescription:
            --- A summary of the event
        -- eventDate: 
            --- Just the starting date in a format like Wednesday, April 26, 2025, Saturday, May 10, 2025, etc
            --- For context, today's date is: ${getCurrentDate()}
        -- eventTime: 
            --- Just the starting time in a format like 4:00 PM, 10:00 AM, etc
     of the event happening.
    
     - If the email is not about an event, then return null as the value for each of the afore-mentioned.

    Return your answer in pure JSON format (do not use any preambles or concluding statements).
    Use this JSON schema for your response:
    {"eventName": string, "eventLocation": string, "eventDescription": string, "eventDate": string, "eventTime": string}

    The email is:
    ${emailContent}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        },
    });
    try {
        const llm_response = JSON.parse(response.text);
        const validEvents = llm_response.filter(event => {
            for (const key in event) {
                if (event[key] === null || event[key] === "null") {
                    return false;
                }
                if (key === "eventLocation") {
                    event["eventLocationID"] = locationMap[event[key]];
                    delete event[key];
                }
            }
            return true;
        });

        return validEvents;
        
    } catch (error) {
        console.error("Error parsing JSON response:", response.text, error);
        return null; // Or handle the error as needed
    }
}