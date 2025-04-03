from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, jwt_required
from app.models.user import User
from app.extensions import db
from werkzeug.security import generate_password_hash, check_password_hash


auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/register', methods=['POST']) # Объявляем роут /register
def register():
  email = request.form.get('email') # Достаем из тела запроса почту
  password = request.form.get('password') # Достаем из тела пароль

  if not validate_password(password): # Валидируем пароль
    return jsonify(msg='The password must contain from 6 to 120 characters and must not contain spaces'), 400

  candidate = User.query.filter_by(email=email).first() # Ищем пользователя с такой же эл. почтой

  if candidate: # Если таковой найден, то возвращаем ошибку, иначе регистрируем его
    return jsonify(msg='This email already exists'), 409
  else:
    name = request.form.get('name') # Достаем имя из тела запроса

    password_hash = generate_password_hash(password) # Генерируем хэш пароля
    user = User(name=name, email=email, password_hash=password_hash) # Создаем нового пользователя по модели

    db.session.add(user) # Добавляем пользователя в БД
    db.session.commit() # Сохраняем изменения в БД

    access_token = create_access_token(identity=email) # Генерируем access-токен
    refresh_token = create_refresh_token(identity=email) # Генерируем refresh-токен

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 201 # Отправляем токены в ответ клиенту


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


@auth_bp.route('/refresh', methods=['POST']) # Регистрируем роут /refresh
@jwt_required(refresh=True) # Делаем обязательным наличие refresh-токена в запросе
def refresh():
  current_user_email = get_jwt_identity() # Достаем почту из токена
  new_access_token = create_access_token(identity=current_user_email) # Генерируем новый access-токен

  return jsonify({'access_token': new_access_token}), 200 # Возвращаем сгенерированный токен


def validate_password(password):
  if ' ' in password: return False
  length = len(password)
  if length < 6 or length > 120: return False
  return True