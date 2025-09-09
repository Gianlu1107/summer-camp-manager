

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from database import db
from models import User
from utils import verify_password

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'detail': 'Username e password richiesti'}), 400
    
    user = User.query.filter_by(username=username).first()
    if not user or not verify_password(password, user.password_hash):
        return jsonify({'detail': 'Credenziali non valide'}), 401
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'role': user.role,
        'team_id': user.team_id
    })