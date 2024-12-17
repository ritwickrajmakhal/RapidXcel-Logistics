import click
from flask import current_app
from flask_migrate import Migrate, upgrade
from . import db

def init_app(app):
    migrate = Migrate(app, db)
    app.cli.add_command(init_db_command)

@click.command('init-db')
def init_db_command():
    """Apply database migrations."""
    upgrade()
    click.echo("Database upgraded.")