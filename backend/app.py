from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

# blueprint import
from routes.auth import auth_bp
from routes.animati import animati_bp
from routes.giochi import giochi_bp
from routes.admin import admin_bp

from database import db  # l'oggetto db dal database.py

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)  # permette tutte le origini e metodi

# config db
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    'DATABASE_URL',
    'postgresql://neondb_owner:npg_4LvK9InoaSuE@ep-late-fog-a2nuw1fo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.secret_key = os.getenv('SECRET_KEY', 'supersecretkey')

db.init_app(app)  # inizializza db con questa app

# registrazione blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(animati_bp, url_prefix='/animati')
app.register_blueprint(giochi_bp, url_prefix='/giochi')
app.register_blueprint(admin_bp, url_prefix='/admin')

# health check
@app.route('/health', methods=['GET'])
def health_check():
    return {'status': 'ok'}

if __name__ == '__main__':
    # debug info sulle rotte
    print("Rotte registrate:")
    for rule in app.url_map.iter_rules():
        print(rule)
    app.run(host='0.0.0.0', port=5000, debug=True)