import win32com.client
import requests
import json  
import logging  
import os
from dotenv import load_dotenv

load_dotenv('.env')

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class OutlookEmailFetcher:
    def __init__(self, account_name):
        self.account_name = account_name
        self.outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
        self.account = self._get_account() 

    def _get_account(self):
        try:
            for acc in self.outlook.Folders:
                if acc.Name == self.account_name:
                    return acc
            return None
        except Exception as e:
            return None

    def fetch_emails(self, limit=5):
        if self.account is None:
            return []  

        try:
            inbox = self.account.Folders["Inbox"]
            messages = inbox.Items
            messages.Sort("[ReceivedTime]", True)
        except Exception as e:
            return []

        email_bodies = []
        for i, message in enumerate(messages):
            if i >= limit:
                break
            try:
                email_bodies.append(message.Body)
            except Exception as e:
                pass
        return email_bodies


class APICommunicator:
    def __init__(self, api_endpoint):
        self.api_endpoint = api_endpoint

    def send_data(self, data):
        headers = {'Content-Type': 'application/json'}
        try:
            response = requests.post(self.api_endpoint, data=json.dumps(data), headers=headers)
            response.raise_for_status()
        except Exception as e:
            pass



def main():
    email_limit = os.getenv('EMAIL_LIMIT')
    account_name = os.getenv('OUTLOOK_ACCOUNT')
    api_endpoint = f"{os.getenv('BACKEND_API')}/emails"
    email_fetcher = OutlookEmailFetcher(account_name)
    api_communicator = APICommunicator(api_endpoint)

    email_data = email_fetcher.fetch_emails(email_limit)

    if email_data:
        api_communicator.send_data(email_data)

if __name__ == "__main__":
    main()
