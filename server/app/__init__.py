from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import ConfigDev


db = SQLAlchemy()
ma = Marshmallow()
jwt = JWTManager()
cors = CORS()


def create_app(config_class=ConfigDev) -> Flask:
    """Factory"""
    app = Flask(__name__)
    app.config.from_object(config_class)
    db.init_app(app)
    ma.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    with app.app_context():
        register_blueprints(app)
        db.create_all()

        return app


def register_blueprints(app):
    from app.auth.routes import auth_blueprint
    from app.task.routes import task_blueprint

    app.register_blueprint(auth_blueprint, url_prefix='/token')
    app.register_blueprint(task_blueprint, url_prefix='/api_v1/tasks')
