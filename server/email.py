import win32com.client

def get_outlook_emails(account_name="26100146@lums.edu.pk", limit=50):
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

emails = get_outlook_emails()
for idx, email in enumerate(emails[:5]):  # Print first 5 emails for preview
    print(f"Email {idx + 1}:\n{email}\n{'-'*50}")
