from marshmallow import fields
from marshmallow.validate import Length, Email
from app.extensions import db, ma


class User(db.Model):
  __tablename__ = 'user'

  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), nullable=False)
  email = db.Column(db.String(80), nullable=False, unique=True)
  password_hash = db.Column(db.String(256), nullable=False)


class UserSchema(ma.Schema):
  class Meta:
    model = User
    load_instance = True

  id = fields.Int(dump_only=True)
  name = fields.Str(required=True, validate=Length(min=3, max=80))
  email = fields.Str(required=True, validate=[Length(min=3, max=80), Email()])
  password_hash = fields.Str(required=True, validate=Length(max=256))


user_schema = UserSchema()
users_schema = UserSchema(many=True)