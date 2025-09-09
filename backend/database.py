from flask_sqlalchemy import SQLAlchemy
from passlib.context import CryptContext
from datetime import datetime

# ---------------------------
# Database setup
# ---------------------------
db = SQLAlchemy()

def init_app(app, database_url):
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)

# ---------------------------
# utility hash password
# ---------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# ---------------------------
# modelli importati dopo db per evitare loop
# ---------------------------
from models import User, Team, Kid, Game, Score, RefereeShift

# ---------------------------
# inizializzazione dati di prova
# ---------------------------
def init_db(app):
    with app.app_context():
        db.create_all()

        # crea team di prova
        if not Team.query.first():
            team1 = Team(name="rosso", color="red")
            team2 = Team(name="blu", color="blue")
            db.session.add_all([team1, team2])
            db.session.commit()

        # crea user di prova
        if not User.query.first():
            team1 = Team.query.filter_by(name="rosso").first()
            team2 = Team.query.filter_by(name="blu").first()

            user1 = User(username="admin", password_hash=get_password_hash("admin123"), role="admin", team=team1)
            user2 = User(username="accoglienza", password_hash=get_password_hash("acc123"), role="accoglienza", team=team2)
            user3 = User(username="arbitro", password_hash=get_password_hash("arb123"), role="arbitro", team=None)

            db.session.add_all([user1, user2, user3])
            db.session.commit()