from dotenv import load_dotenv
from datetime import datetime
import os
import google.generativeai as genai

load_dotenv('server/configurations/keys.env')

api_key = os.getenv('GEMINI_API_KEY')
if api_key is None:
    raise ValueError("GEMENI_API_KEY not set.")
genai.configure(api_key=api_key)


class LLM:
    def __init__(self):
        self.generation_config = {
            "temperature": 1,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 8192,
            "response_mime_type": "text/plain",
        }

        self.model = genai.GenerativeModel(
            model_name="gemini-2.0-flash",
            generation_config=self.generation_config,
            system_instruction='''
              Extract crucial information from the emails. I only need the NAME, TIME, VENUE, and DATE of the events happening. Extract any associating information aswell 
              and attach it to its respective category such as days should be included in the date category and rooms should be included in the venue (if any). Remove the commas in 
              between so that parsing is easier. An example being VENUE: Academic Block, Room A3 should be just VENUE: Academic Block Room A3. In the case that information for a
              certain category is not in the email, write None there. Don't forget to format your response. 
              Format your response as: 
              Name: [name] 
              Time: [time] 
              Venue: [venue] 
              Date: [date]", 
              '''
        )

    def extract_event_info(self, email_text):
        try:
            chat_session = self.model.start_chat()  # No history needed for single email processing
            response = chat_session.send_message(email_text)
            model_response = response.text

            event_data = {}
            lines = model_response.strip().splitlines()
            for line in lines:
                try:
                    key, value = line.split(":", 1)
                    event_data[key.strip()] = value.strip()
                except ValueError:
                    print(f"Warning: Could not parse line: {line}")

            name = event_data.get("Name")
            time = event_data.get("Time")
            venue = event_data.get("Venue")
            date = event_data.get("Date")

            return {"Name": name, "Time": time, "Venue": venue, "Date": date}

        except Exception as e:
            print(f"Error processing email: {e}")
            return {f"error": "can not extract info from email: {e}"}