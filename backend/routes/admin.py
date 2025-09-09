


from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from database import db
from models import User, Team, Kid, RefereeShift
from utils import hash_password
from werkzeug.security import generate_password_hash
from datetime import datetime

admin_bp = Blueprint('admin', __name__, url_prefix='/api/admin')

# ----------- USERS -----------
@admin_bp.route('/users', methods=['GET'])
@cross_origin()
def get_users():
    try:
        users = User.query.all()
        return jsonify([{
            'id': u.id,
            'username': u.username,
            'role': u.role,
            'team_id': u.team_id
        } for u in users]), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users', methods=['POST'])
@cross_origin()
def create_user():
    data = request.json
    try:
        username = data['username']
        password = data['password']
        role = data['role']
        team_id = data.get('team_id')
        # Use werkzeug secure hash
        hashed_pw = generate_password_hash(password)
        user = User(username=username, password_hash=hashed_pw,
                    role=role, team_id=team_id)
        db.session.add(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User created', 'id': user.id}), 201
    except IntegrityError as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Username already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['PUT'])
@cross_origin()
def update_user(user_id):
    data = request.json
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        user.username = data.get('username', user.username)
        if 'password' in data and data['password']:
            user.password_hash = generate_password_hash(data['password'])
        user.role = data.get('role', user.role)
        user.team_id = data.get('team_id', user.team_id)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/users/<int:user_id>', methods=['DELETE'])
@cross_origin()
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({'success': False, 'error': 'User not found'}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({'success': True, 'message': 'User deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# ----------- TEAMS -----------
@admin_bp.route('/teams', methods=['GET'])
@cross_origin()
def get_teams():
    try:
        teams = Team.query.all()
        return jsonify([{'id': t.id, 'name': t.name, 'color': t.color, 'points': t.points} for t in teams]), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/teams', methods=['POST'])
@cross_origin()
def create_team():
    data = request.json
    try:
        team = Team(name=data['name'], color=data.get('color'), points=data.get('points', 0))
        db.session.add(team)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Team created', 'id': team.id}), 201
    except IntegrityError:
        db.session.rollback()
        return jsonify({'success': False, 'error': 'Team name already exists'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/teams/<int:team_id>', methods=['PUT'])
@cross_origin()
def update_team(team_id):
    data = request.json
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'success': False, 'error': 'Team not found'}), 404
        team.name = data.get('name', team.name)
        team.color = data.get('color', team.color)
        if 'points' in data:
            team.points = data['points']
        db.session.commit()
        return jsonify({'success': True, 'message': 'Team updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/teams/<int:team_id>', methods=['DELETE'])
@cross_origin()
def delete_team(team_id):
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'success': False, 'error': 'Team not found'}), 404
        db.session.delete(team)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Team deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# ----------- KIDS (ANIMATI) -----------
@admin_bp.route('/kids', methods=['GET'])
@cross_origin()
def get_kids():
    try:
        kids = Kid.query.all()
        return jsonify([{
            'id': k.id,
            'first_name': k.first_name,
            'last_name': k.last_name,
            'team_id': k.team_id,
            'present': k.present,
            'lunch': k.lunch
        } for k in kids]), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/kids', methods=['POST'])
@cross_origin()
def create_kid():
    data = request.json
    try:
        kid = Kid(
            first_name=data['first_name'],
            last_name=data['last_name'],
            team_id=data['team_id'],
            present=data.get('present', False),
            lunch=data.get('lunch', False)
        )
        db.session.add(kid)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Kid created', 'id': kid.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/kids/<int:kid_id>', methods=['PUT'])
@cross_origin()
def update_kid(kid_id):
    data = request.json
    try:
        kid = Kid.query.get(kid_id)
        if not kid:
            return jsonify({'success': False, 'error': 'Kid not found'}), 404
        kid.first_name = data.get('first_name', kid.first_name)
        kid.last_name = data.get('last_name', kid.last_name)
        kid.team_id = data.get('team_id', kid.team_id)
        if 'present' in data:
            kid.present = data['present']
        if 'lunch' in data:
            kid.lunch = data['lunch']
        db.session.commit()
        return jsonify({'success': True, 'message': 'Kid updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/kids/<int:kid_id>', methods=['DELETE'])
@cross_origin()
def delete_kid(kid_id):
    try:
        kid = Kid.query.get(kid_id)
        if not kid:
            return jsonify({'success': False, 'error': 'Kid not found'}), 404
        db.session.delete(kid)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Kid deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# ----------- REFEREE SHIFTS (TURNI) -----------
@admin_bp.route('/shifts', methods=['GET'])
@cross_origin()
def get_shifts():
    try:
        shifts = RefereeShift.query.all()
        return jsonify([{
            'id': s.id,
            'user_id': s.user_id,
            'game_id': s.game_id,
            'shift_start': s.shift_start.isoformat() if s.shift_start else None,
            'shift_end': s.shift_end.isoformat() if s.shift_end else None
        } for s in shifts]), 200
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/shifts', methods=['POST'])
@cross_origin()
def create_shift():
    data = request.json
    try:
        # Parse datetime fields if needed
        shift_start = data['shift_start']
        shift_end = data['shift_end']
        if isinstance(shift_start, str):
            shift_start = datetime.fromisoformat(shift_start)
        if isinstance(shift_end, str):
            shift_end = datetime.fromisoformat(shift_end)
        shift = RefereeShift(
            user_id=data['user_id'],
            game_id=data['game_id'],
            shift_start=shift_start,
            shift_end=shift_end
        )
        db.session.add(shift)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Shift created', 'id': shift.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/shifts/<int:shift_id>', methods=['PUT'])
@cross_origin()
def update_shift(shift_id):
    data = request.json
    try:
        shift = RefereeShift.query.get(shift_id)
        if not shift:
            return jsonify({'success': False, 'error': 'Shift not found'}), 404
        if 'user_id' in data:
            shift.user_id = data['user_id']
        if 'game_id' in data:
            shift.game_id = data['game_id']
        if 'shift_start' in data:
            shift_start = data['shift_start']
            if isinstance(shift_start, str):
                shift_start = datetime.fromisoformat(shift_start)
            shift.shift_start = shift_start
        if 'shift_end' in data:
            shift_end = data['shift_end']
            if isinstance(shift_end, str):
                shift_end = datetime.fromisoformat(shift_end)
            shift.shift_end = shift_end
        db.session.commit()
        return jsonify({'success': True, 'message': 'Shift updated'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

@admin_bp.route('/shifts/<int:shift_id>', methods=['DELETE'])
@cross_origin()
def delete_shift(shift_id):
    try:
        shift = RefereeShift.query.get(shift_id)
        if not shift:
            return jsonify({'success': False, 'error': 'Shift not found'}), 404
        db.session.delete(shift)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Shift deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500

# ----------- TEAM POINTS (PUNTEGGI) -----------
@admin_bp.route('/teams/<int:team_id>/points', methods=['PUT'])
@cross_origin()
def update_team_points(team_id):
    data = request.json
    try:
        team = Team.query.get(team_id)
        if not team:
            return jsonify({'success': False, 'error': 'Team not found'}), 404
        if 'points' not in data:
            return jsonify({'success': False, 'error': 'Missing points field'}), 400
        team.points = data['points']
        db.session.commit()
        return jsonify({'success': True, 'message': 'Team points updated', 'points': team.points}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500