from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='src')

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/speedsense')
def speedsense():
    return send_from_directory('.', 'speedsense.html')

@app.route('/rental-leasing')
def rental_leasing():
    return send_from_directory('.', 'rental-leasing.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print("Starting Flask server...")
    print("Server running at http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='0.0.0.0', port=5000) 