from app.extensions import db, ma


class User(db.Model):
  __tablename__ = 'user'
  id = db.Column(db.Integer, primary_key=True)
  name = db.Column(db.String(80), nullable=False)
  email = db.Column(db.String(80), nullable=False, unique=True)
  password_hash = db.Column(db.String(120), nullable=False)


class UserSchema(ma.Schema):
  class Meta:
    model = User
    fields = ('id', 'name', 'email', 'password_hash')


user_schema = UserSchema()
users_schema = UserSchema(many=True)