#!/usr/bin/env python3
"""
Serveur de développement avec anti-cache pour Sweet Daisies Orchestra
"""
import http.server
import socketserver
from datetime import datetime

class NoCacheHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        # CORS pour le développement
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime('[%Y-%m-%d %H:%M:%S]')
        print(f"{timestamp} - {format % args}")

if __name__ == "__main__":
    PORT = 3000
    handler = NoCacheHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), handler) as httpd:
        print(f"🌸 Sweet Daisies Orchestra - Serveur de développement")
        print(f"🚀 Démarré sur le port {PORT}")
        print(f"📱 URL : http://localhost:{PORT}")
        print(f"🔄 Anti-cache activé pour voir les changements CSS immédiatement")
        print(f"⏹️  Appuyez sur Ctrl+C pour arrêter")
        print("-" * 60)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print(f"\n🛑 Serveur arrêté")