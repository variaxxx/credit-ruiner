from datetime import timedelta
from dotenv import load_dotenv
from os import getenv

load_dotenv()

class Config:
  JWT_SECRET_KEY = getenv('JWT_SECRET_KEY')
  JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=5)
  JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
  SQLALCHEMY_DATABASE_URI = 'sqlite:///db.sqlite3'