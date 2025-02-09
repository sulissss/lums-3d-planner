from flask import Flask, jsonify, request
from llm import LLM
import os
import json

app = Flask(__name__)
model = LLM()

@app.route('/')
def index():
    return jsonify({"message": "hello"})

@app.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    return jsonify({"message": f"You sent: {body}"})


@app.route('/notifications', methods=['POST'])
def handle_notifications():
    if 'validationToken' in request.args:
        validation_token = request.args['validationToken']
        return validation_token, 200, {'Content-Type': 'text/plain; charset=utf-8'}

    data = request.get_json()

    if data:
        # client_state = data.get('clientState')
        # if client_state != 'secret_client_state':
        #     return jsonify({'error': 'Invalid client state'}), 400

        for notification in data.get('value', []):
            resource_data = notification.get('resourceData')
            # Process the email data (resource_data) here

            print(model.extract_event_info(resource_data))
            # print(json.dumps(resource_data, indent=4))

        return jsonify({'status': 'accepted'}), 202
    else:
        return jsonify({'error': 'No data received'}), 400
    

if __name__ == "__main__":
    app.run(debug=True)