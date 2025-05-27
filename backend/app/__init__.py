from flask import Flask
from flask_cors import CORS
from .config import Config
from .extensions import jwt, ma, db
from .routes import register_routes
from .models import *
from .cli_commands import db_cli


def create_app():
  app = Flask(__name__)
  app.config.from_object(Config)

  CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

  # Model loading
  # model = joblib.load('instance/model.pkl')

  # Extensions initialization
  db.init_app(app)
  jwt.init_app(app)
  ma.init_app(app)

  # Tables creation
  with app.app_context():
    db.create_all()

  app.cli.add_command(db_cli)

  # Routes registration
  register_routes(app)

  return app