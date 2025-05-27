from flask.cli import AppGroup
from app.extensions import db


db_cli = AppGroup('db')


@db_cli.command('create')
def db_create():
    db.create_all()
    print('Database created')


@db_cli.command('drop')
def db_drop():
    db.drop_all()
    print('Database dropped')