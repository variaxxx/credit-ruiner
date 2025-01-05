from datetime import timedelta


class Config:
  JWT_SECRET_KEY = 'b86d77ef970b4468a75e093099f681f7'
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
  JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
  SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'