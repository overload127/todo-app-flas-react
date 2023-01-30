from flask_migrate import Migrate
from dotenv import load_dotenv
from config import ConfigDev
from app import create_app, db
from migrate import *


app = create_app(ConfigDev)
migrate = Migrate(app, db)
