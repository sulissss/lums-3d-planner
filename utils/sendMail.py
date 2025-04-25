import win32com.client
import requests
import json  
import logging  
import os
from dotenv import load_dotenv

load_dotenv('.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class OutlookEmailFetcher:
    """
    A class responsible for fetching emails from Microsoft Outlook.

    This class encapsulates the logic for interacting with the Outlook application
    and retrieving email data.  It follows the Single Responsibility Principle.
    """
    def __init__(self, account_name="26100146@lums.edu.pk"):
        """
        Initializes the OutlookEmailFetcher with the specified account name.

        Args:
            account_name (str, optional): The name of the Outlook account.
                Defaults to "26100146@lums.edu.pk".
        """
        self.account_name = account_name
        self.outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
        self.account = self._get_account() 

    def _get_account(self):
        """
        Retrieves the Outlook account object.

        Returns:
            object: The Outlook account object, or None if not found.
        """
        try:
            for acc in self.outlook.Folders:
                if acc.Name == self.account_name:
                    return acc
            logging.error(f"Account '{self.account_name}' not found in Outlook.")
            return None
        except Exception as e:
            logging.error(f"Error accessing Outlook accounts: {e}")
            return None

    def fetch_emails(self, limit=5):
        """
        Fetches the latest email bodies from the Outlook inbox.

        Args:
            limit (int, optional): The maximum number of emails to fetch. Defaults to 5.

        Returns:
            list: A list of email bodies (strings), or an empty list on error.
                  Returns a list of strings.
        """
        if self.account is None:
            return []  # Return empty list if no account.

        try:
            inbox = self.account.Folders["Inbox"]
            messages = inbox.Items
            messages.Sort("[ReceivedTime]", True)  # Sort by received time, newest first
        except Exception as e:
            logging.error(f"Error accessing Inbox or sorting messages: {e}")
            return []

        email_bodies = []
        for i, message in enumerate(messages):
            if i >= limit:
                break
            try:
                email_bodies.append(message.Body)
            except Exception as e:
                logging.error(f"Error reading email {i + 1}: {e}")  # Log the error with email number
        return email_bodies


class APICommunicator:
    """
    A class responsible for sending data to an API endpoint.

    This class handles the communication with the API, including sending the data
    and handling potential errors. It follows the Single Responsibility Principle.
    """
    def __init__(self, api_endpoint):
        """
        Initializes the APICommunicator with the API endpoint URL.

        Args:
            api_endpoint (str): The URL of the API endpoint.
        """
        self.api_endpoint = api_endpoint

    def send_data(self, data):
        """
        Sends data to the API endpoint.

        Args:
            data (list): The data to send (e.g., a list of email bodies).

        Returns:
            tuple: (status_code, response_text) on success, (None, None) on error.
        """
        headers = {'Content-Type': 'application/json'}
        try:
            response = requests.post(self.api_endpoint, data=json.dumps(data), headers=headers)
            response.raise_for_status()
            return response.status_code, response.text
        except requests.exceptions.RequestException as e:
            logging.error(f"Error sending data to API: {e}")
            return None, None
        except Exception as e:
            logging.error(f"Unexpected error sending data: {e}")
            return None, None



def main():
    """
    Main function to orchestrate the email fetching and data sending process.
    """
    email_limit = 5
    account_name = os.getenv('OUTLOOK_ACCOUNT')
    api_endpoint = f"{os.getenv('BACKEND_API')}/emails"
    # Instantiate the classes
    email_fetcher = OutlookEmailFetcher(account_name)
    api_communicator = APICommunicator(api_endpoint)

    # Fetch emails
    email_data = email_fetcher.fetch_emails(email_limit)

    # Send data if emails were fetched
    if email_data:
        logging.info(f"Fetched {len(email_data)} emails from Outlook.")
        status_code, response_text = api_communicator.send_data(email_data)
        if status_code:
            logging.info(f"Data sent successfully. Status Code: {status_code}, Response: {response_text}")
        else:
            logging.error("Failed to send data to the API.")
    else:
        logging.warning("No emails fetched from Outlook.")

if __name__ == "__main__":
    main()
