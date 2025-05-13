import http.server
import socketserver
import os

PORT = 8000

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

    def guess_type(self, path):
        # Add custom MIME types
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.css'):
            return 'text/css'
        if path.endswith('.mp4'):
            return 'video/mp4'
        if path.endswith('.webm'):
            return 'video/webm'
        return super().guess_type(path)

    def handle(self):
        try:
            super().handle()
        except BrokenPipeError:
            print("Client closed connection (BrokenPipeError) — ignoring.")

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            print(f"404 Not Found: {self.path}")
        super().send_error(code, message, explain)

Handler = CustomHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    print("Press Ctrl+C to stop the server")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close() 