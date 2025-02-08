from aiohttp import ClientSession
from msal import ConfidentialClientApplication
from azure.identity import ClientSecretCredential
from dotenv import load_dotenv
import os

load_dotenv('configurations/config.env')

class Graph:
    def __init__(self, config):
        self.settings = config
        self.client_id = self.settings['clientId']
        self.tenant_id = self.settings['tenantId']
        self.client_secret = self.settings['clientSecret']

        self.client_credential = ClientSecretCredential(
            tenant_id=self.tenant_id,
            client_id=self.client_id,
            client_secret=self.client_secret
        )
        self.app_client = ConfidentialClientApplication(
            client_id=self.client_id,
            client_credential=self.client_secret,
            authority=f"https://login.microsoftonline.com/{self.tenant_id}"
        )

    async def get_app_only_token(self):  # For application permissions
        result = self.app_client.acquire_token_for_client(scopes=["https://graph.microsoft.com/.default"])
        return result['access_token']

    async def get_user_token(self): # For delegated permissions (user-specific)
        scopes = ["Mail.Read"] # Or other relevant scopes
        result = self.app_client.acquire_token_for_user(scopes=scopes) # Requires interactive login
        return result['access_token']
    
    async def set_user_id_by_email(self, email):
        async with ClientSession() as session:
            headers = {
                'Authorization': f'Bearer {await self.get_app_only_token()}',
                'Content-Type': 'application/json'
            }
            endpoint = f'https://graph.microsoft.com/v1.0/users/{email}'
            async with session.get(endpoint, headers=headers) as response:
                if response.status == 200:
                    user_data = await response.json()
                    self.user_id = user_data.get('id')
                    return self.user_id
                else:
                    print("Failed to retrieve user:", await response.text())
                    return None

    async def get_emails(self, user_id=None): # user_id is optional, defaults to the one in the config
        if self.user_id is None:
            print("Error: User ID not set.")
            return []
        
        token = await self.get_app_only_token() # Or await self.get_user_token() if you're using delegated permissions

        if user_id is None:
            user_id = self.user_id # Use the user ID from the config if none is provided

        async with ClientSession() as session:
            headers = {
                'Authorization': f'Bearer {token}',
                'Content-Type': 'application/json'
            }
            endpoint = f'https://graph.microsoft.com/v1.0/users/{user_id}/messages' # or /me if using delegated permissions
            async with session.get(endpoint, headers=headers) as response:
                if response.status == 200:
                    emails = await response.json()
                    return emails.get('value', []) # Returns an empty list if no emails
                else:
                    print("Failed to get emails:", await response.text())
                    return [] # Return an empty list on error

# Example usage (replace with your actual configuration):
async def main():
    config = {
        'clientId': os.getenv('CLIENT_ID'),
        'tenantId': os.getenv('TENANT_ID'),
        'clientSecret': os.getenv('CLIENT_SECRET'),
    }

    # print(config)

    graph = Graph(config)
    # print(await graph.get_app_only_token())
    # print(await graph.set_user_id_by_email("26100350@lums.edu.pk"))
    # emails = await graph.get_emails()  # or await graph.get_emails(specific_user_id) if you want a different user

    # if emails:
    #     for email in emails:
    #         print(f"Subject: {email.get('subject')}")
    #         # print(f"Body: {email.get('body').get('content')}") # Uncomment to see the body (might be large)
    #         print("-" * 20)
    # else:
    #     print("No emails found.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(main())