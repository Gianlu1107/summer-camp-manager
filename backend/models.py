from datetime import datetime
from database import db

class Team(db.Model):
    __tablename__ = "teams"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    color = db.Column(db.String(50), nullable=True)
    total_score = db.Column(db.Integer, default=0, nullable=False)

    kids = db.relationship('Kid', backref='team', cascade="all, delete-orphan")
    users = db.relationship('User', backref='team')
    scores = db.relationship('Score', backref='team', cascade="all, delete-orphan")

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # admin | accoglienza | arbitro
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=True)

    referee_shifts = db.relationship('RefereeShift', backref='user', cascade="all, delete-orphan")

class Kid(db.Model):
    __tablename__ = "kids"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    present = db.Column(db.Boolean, default=False, nullable=False)
    lunch = db.Column(db.Boolean, default=False, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('first_name', 'last_name', 'team_id', name='uq_kid_name_team'),
    )

class Game(db.Model):
    __tablename__ = "games"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.String(255), nullable=True)

    scores = db.relationship('Score', backref='game', cascade="all, delete-orphan")
    referee_shifts = db.relationship('RefereeShift', backref='game', cascade="all, delete-orphan")

class Score(db.Model):
    __tablename__ = "scores"

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    points = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        db.UniqueConstraint('game_id', 'team_id', name='uq_score_game_team'),
    )

class RefereeShift(db.Model):
    __tablename__ = "referee_shifts"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'), nullable=False)
    shift_start = db.Column(db.DateTime, nullable=False)
    shift_end = db.Column(db.DateTime, nullable=False)
