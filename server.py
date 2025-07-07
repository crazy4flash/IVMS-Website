from flask import Flask, send_from_directory
import os
import argparse

app = Flask(__name__)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/speedsense')
def speedsense():
    return send_from_directory('.', 'speedsense.html')

@app.route('/rental-leasing')
def rental_leasing():
    return send_from_directory('.', 'rental-leasing.html')

@app.route('/governments')
def governments():
    return send_from_directory('.', 'governments.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Run the Flask server.')
    parser.add_argument('--port', type=int, default=5000, help='Port to run the server on')
    args = parser.parse_args()
    print("Starting Flask server...")
    print(f"Server running at http://localhost:{args.port}")
    print("Press Ctrl+C to stop the server")
    app.run(debug=True, host='0.0.0.0', port=args.port) 