from flask import Flask, jsonify, request
import os

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"message": "hello"})

@app.route('/register', methods=['POST'])
def register():
    body = request.get_json()
    return jsonify({"message": f"You sent: {body}"})

if __name__ == "__main__":
    app.run(debug=True)