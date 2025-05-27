from .account import account_bp
from .analysis import analysis_bp
from .auth import auth_bp


def register_routes(app):
  app.register_blueprint(auth_bp, url_prefix='/auth')
  app.register_blueprint(account_bp, url_prefix='/account')
  app.register_blueprint(analysis_bp, url_prefix='/analysis')