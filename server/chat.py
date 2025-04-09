import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMENI_API_KEY")
if api_key is None:
    raise ValueError("GEMENI_API_KEY not set.")
genai.configure(api_key=api_key)

generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config=generation_config,
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

history = []  # Initialize history *outside* the loop
all_extracted_data = []  # List to store data from all emails



while True:
    user_input = input("Enter email text (or 'exit' to quit): ")
    if user_input.lower() == 'exit':
        break

    chat_session = model.start_chat(history=history)  # Pass history here!

    response = chat_session.send_message(user_input)
    model_response = response.text
    print("------------------------------------------------------------------")
    print("Gemini:-")
    print(model_response)
    print("------------------------------------------------------------------")

    event_data = {}
    lines = model_response.strip().splitlines()  # Split into lines
    for line in lines:
        try:
            key, value = line.split(":", 1)  # Split at the first colon only
            event_data[key.strip()] = value.strip()
        except ValueError:
            print(f"Warning: Could not parse line: {line}")

    name = event_data.get("Name")
    time = event_data.get("Time")
    venue = event_data.get("Venue")
    date = event_data.get("Date")

    # print("\nExtracted Data:")
    # print(f"Name: {name}")
    # print(f"Time: {time}")
    # print(f"Venue: {venue}")
    # print(f"Date: {date}")
    # print("------------------------------------------------------------------")

    missing_fields = []
    for field in ["Name", "Time", "Venue", "Date"]:
        if event_data.get(field) == "None":
            missing_fields.append(field)

    if missing_fields:
        print(f"Warning: Some fields are missing: {', '.join(missing_fields)}")

    all_extracted_data.append(event_data) #Store the extracted data

    history.append({"role": "user", "parts": [user_input]})
    history.append({"role": "model", "parts": [model_response]})

# Print ALL extracted data *after* the loop
print("\n--- All Extracted Data ---")
for i, data in enumerate(all_extracted_data):
    print(f"\nEmail {i+1}:")
    for key, value in data.items():
        print(f"{key}: {value}")
    print("------------------------------------------------------------------")