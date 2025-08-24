from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///marcas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Marca(db.Model):
    __tablename__ = 'marcas'
    
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100), nullable=False)
    descripcion = db.Column(db.Text, nullable=False)
    categoria = db.Column(db.String(50), nullable=False)
    fecha_registro = db.Column(db.DateTime, default=datetime.utcnow)
    estado = db.Column(db.String(20), default='Pendiente')
    propietario = db.Column(db.String(100), nullable=False)
    numero_registro = db.Column(db.String(50), unique=True)
    
    def __init__(self, nombre, descripcion, categoria, propietario, estado='Pendiente'):
        self.nombre = nombre
        self.descripcion = descripcion
        self.categoria = categoria
        self.propietario = propietario
        self.estado = estado
        self.numero_registro = self.generar_numero_registro()
    
    def generar_numero_registro(self):
        ultima_marca = Marca.query.order_by(Marca.id.desc()).first()
        if ultima_marca and ultima_marca.numero_registro:
            try:
                ultimo_numero = int(ultima_marca.numero_registro.split('-')[1])
                nuevo_numero = ultimo_numero + 1
            except (IndexError, ValueError):
                nuevo_numero = 1
        else:
            nuevo_numero = 1
        return f"MR-{nuevo_numero}"
    
    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'descripcion': self.descripcion,
            'categoria': self.categoria,
            'fechaRegistro': self.fecha_registro.isoformat() if self.fecha_registro else None,
            'estado': self.estado,
            'propietario': self.propietario,
            'numeroRegistro': self.numero_registro
        }

with app.app_context():
    db.create_all()

def handler(request):
    with app.app_context():
        if request.method == 'GET':
            if 'id' in request.args:
                marca = Marca.query.get_or_404(request.args['id'])
                return jsonify(marca.to_dict())
            else:
                marcas = Marca.query.all()
                return jsonify([marca.to_dict() for marca in marcas])
        
        elif request.method == 'POST':
            data = request.get_json()
            marca = Marca(
                nombre=data['nombre'].strip(),
                descripcion=data['descripcion'].strip(),
                categoria=data['categoria'].strip(),
                propietario=data['propietario'].strip()
            )
            db.session.add(marca)
            db.session.commit()
            return jsonify(marca.to_dict()), 201
        
        elif request.method == 'PUT':
            marca_id = request.args.get('id')
            marca = Marca.query.get_or_404(marca_id)
            data = request.get_json()
            
            marca.nombre = data['nombre'].strip()
            marca.descripcion = data['descripcion'].strip()
            marca.categoria = data['categoria'].strip()
            marca.propietario = data['propietario'].strip()
            marca.estado = data.get('estado', marca.estado)
            
            db.session.commit()
            return jsonify(marca.to_dict())
        
        elif request.method == 'DELETE':
            marca_id = request.args.get('id')
            marca = Marca.query.get_or_404(marca_id)
            db.session.delete(marca)
            db.session.commit()
            return jsonify({'message': 'Marca eliminada correctamente'})