import win32com.client

def fetch_outlook_emails(account_name="26100146@lums.edu.pk", limit=5):
    """Extracts the latest email bodies from a specific Outlook account's inbox."""
    outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    
    # Find the correct account
    for account in outlook.Folders:
        if account.Name == account_name:
            inbox = account.Folders["Inbox"]  # Access Inbox folder
            break
    else:
        print(f"Account '{account_name}' not found in Outlook.")
        return []

    messages = inbox.Items
    messages.Sort("[ReceivedTime]", True)  # Sort by

    email_bodies = []
    
    for i, message in enumerate(messages):
        if i >= limit:  # Stop after 'limit' emails
            break
        try:
            email_bodies.append(message.Body)
        except Exception as e:
            print(f"Error reading email: {e}")

    return email_bodies

# def is_event_email(email):
#     event_keywords = ["event", "invitation", "meeting", "seminar", "conference", "webinar", "session", "workshop"]
#     combined = (email["subject"] or "") + " " + (email["body"] or "")
#     for kw in event_keywords:
#         if kw.lower() in combined.lower():
#             return True
#     return False

# The extract_event_data function requires the Gemini model and history, so we will import them from chat.py in main.py
# We'll just define the interface here for clarity
