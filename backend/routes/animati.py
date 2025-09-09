from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from database import db
from models import Kid
import logging

# Crea il blueprint per la sezione animati
animati_bp = Blueprint('animati', __name__, url_prefix='/animati')

# ----------- GET ANIMATI -----------
@animati_bp.route('/get_animati', methods=['GET'])
@cross_origin()
def get_animati():
    team_id = request.args.get('team_id')
    if not team_id:
        return jsonify({'error': 'team_id required'}), 400
    try:
        team_id = int(team_id)
        kids = Kid.query.filter_by(team_id=team_id).all()
        result = [{
            'id': k.id,
            'first_name': k.first_name.strip(),
            'last_name': k.last_name.strip(),
            'present': k.present,
            'lunch': k.lunch
        } for k in kids]
        return jsonify(result)
    except Exception as e:
        logging.exception("Errore nel recupero animati")
        return jsonify({'error': str(e)}), 500

# ----------- UPDATE ANIMATI -----------
@animati_bp.route('/send_animati', methods=['POST'])
@cross_origin()
def send_animati():
    data = request.get_json()
    if not data or 'kids' not in data:
        return jsonify({'error': 'No kids data provided'}), 400
    try:
        updates = data.get('kids', [])
        for u in updates:
            kid = Kid.query.get(u['id'])
            if kid:
                kid.present = u.get('present', kid.present)
                kid.lunch = u.get('lunch', kid.lunch)
        db.session.commit()
        return jsonify({'message': 'Updated successfully'})
    except Exception as e:
        db.session.rollback()
        logging.exception("Errore nel salvataggio animati")
        return jsonify({'error': str(e)}), 500