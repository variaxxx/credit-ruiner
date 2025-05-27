from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.user import User, user_schema
from app.extensions import db


account_bp = Blueprint('account', __name__)


@account_bp.route('/me', methods=['GET'])
@jwt_required()
def me():
  email = get_jwt_identity()

  user = User.query.filter_by(email=email).first()

  if not user:
    return jsonify(msg="No user found"), 404

  user_info = user_schema.dump(user)
  del user_info['password_hash']

  return jsonify(user_info), 200


@account_bp.route('/me/edit', methods=['PATCH'])
@jwt_required()
def me_edit():
  email = get_jwt_identity()

  user = User.query.filter_by(email=email).first()
  new_user_info = request.form

  errors = user_schema.validate(new_user_info, partial=True)

  if errors:
    return jsonify(errors), 400

  if 'name' in new_user_info:
    user.name = new_user_info['name']
  if 'email' in new_user_info:
    user.email = new_user_info['email']

  db.session.commit()

  user_info = user_schema.dump(user)
  del user_info['password_hash']

  return jsonify(user_info), 200