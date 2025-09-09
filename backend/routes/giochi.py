

from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from database import db
from models import Game, Team, RefereeShift, Score

# Blueprint per la gestione dei giochi
giochi_bp = Blueprint('giochi', __name__, url_prefix='/api')

# ----------- GET TURNI ASSEGNATI ALL'ARBITRO -----------
@giochi_bp.route('/get_turni', methods=['GET'])
@cross_origin()
def get_turni():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'user_id required'}), 400
    turni = RefereeShift.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': t.id,
        'game_id': t.game_id,
        'shift_start': t.shift_start.isoformat(),
        'shift_end': t.shift_end.isoformat()
    } for t in turni])

# ----------- GET SQUADRE PER UN TURNO -----------
@giochi_bp.route('/get_squadre_turno', methods=['GET'])
@cross_origin()
def get_squadre_turno():
    turno_id = request.args.get('turno_id')
    if not turno_id:
        return jsonify({'error': 'turno_id required'}), 400
    turno = RefereeShift.query.get(turno_id)
    if not turno:
        return jsonify({'error': 'Turno non trovato'}), 404
    game = Game.query.get(turno.game_id)
    # esempio semplificato: tutte le squadre partecipanti al gioco
    squadre = [{'id': s.id, 'name': s.name, 'color': s.color} for s in Team.query.all()]
    return jsonify({
        'turno_id': turno.id,
        'game_name': game.name if game else '',
        'squadre': squadre
    })

# ----------- INVIO PUNTEGGIO FINALE -----------
@giochi_bp.route('/submit_punteggio', methods=['POST'])
@cross_origin()
def submit_punteggio():
    data = request.json
    turno_id = data.get('turno_id')
    punteggi = data.get('squadre_punteggi', [])
    
    if not turno_id or not punteggi:
        return jsonify({'error': 'turno_id e punteggi richiesti'}), 400
    
    for p in punteggi:
        score = Score(game_id=p['game_id'], team_id=p['team_id'], points=p['points'])
        db.session.add(score)
    db.session.commit()
    
    return jsonify({'message': 'Punteggi inviati correttamente'})