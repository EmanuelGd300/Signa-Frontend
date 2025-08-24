from http.server import BaseHTTPRequestHandler
import json
import sqlite3
from datetime import datetime
import os

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        marcas = [
            {
                'id': 1,
                'nombre': 'Marca Demo',
                'descripcion': 'Descripción de prueba',
                'categoria': 'Tecnología',
                'propietario': 'Demo User',
                'estado': 'Activo',
                'fechaRegistro': '2024-01-01T00:00:00',
                'numeroRegistro': 'MR-1'
            }
        ]
        
        self.wfile.write(json.dumps(marcas).encode())
    
    def do_POST(self):
        self.send_response(201)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response = {
            'id': 2,
            'nombre': 'Nueva Marca',
            'descripcion': 'Descripción nueva',
            'categoria': 'Tecnología',
            'propietario': 'Usuario',
            'estado': 'Pendiente',
            'fechaRegistro': datetime.now().isoformat(),
            'numeroRegistro': 'MR-2'
        }
        
        self.wfile.write(json.dumps(response).encode())