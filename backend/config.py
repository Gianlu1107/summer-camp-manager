

import os

class Config:
    # secret key per sessioni
    SECRET_KEY = os.getenv('SECRET_KEY', 'supersecretkey')

    # database
    SQLALCHEMY_DATABASE_URI = os.getenv(
        'DATABASE_URL',
        'postgresql://neondb_owner:npg_4LvK9InoaSuE@ep-late-fog-a2nuw1fo-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False