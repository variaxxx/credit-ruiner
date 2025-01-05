from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, user_schema


account_bp = Blueprint('account', __name__)


@account_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
  email = get_jwt_identity()

  user = User.query.filter_by(email=email).first()
  user_info = user_schema.dump(user)
  del user_info['password_hash']

  return jsonify(user_info)