from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from app.models.user import User
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST'])
def register():
  email = request.form.get('email')
  password = request.form.get('password')

  if not validate_password(password):
    return jsonify(msg='The password must contain from 6 to 120 characters and must not contain spaces'), 400

  candidate = User.query.filter_by(email=email).first()

  if candidate:
    return jsonify(msg='This email already exists'), 409
  else:
    name = request.form.get('name')

    password_hash = generate_password_hash(password)
    user = User(name=name, email=email, password_hash=password_hash)

    db.session.add(user)
    db.session.commit()

    return jsonify(msg='User created successfully'), 201


@auth_bp.route('/login', methods=['POST'])
def login():
  email = request.form['email']
  password = request.form['password']

  candidate = User.query.filter_by(email=email).first()

  if not candidate or not check_password_hash(candidate.password_hash, password):
    return jsonify(msg='Invalid credentials'), 401

  access_token = create_access_token(identity=email)
  refresh_token = create_refresh_token(identity=email)

  return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200


@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
  current_user_email = get_jwt_identity()
  new_access_token = create_access_token(identity=current_user_email)

  return jsonify({'access_token': new_access_token}), 200


def validate_password(password):
  if ' ' in password: return False
  length = len(password)
  if length < 6 or length > 120: return False
  return True