from app import db


class Task(db.Model):
    """Object for table tasks"""
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    email = db.Column(db.String(50))
    description = db.Column(db.String(500))
    status = db.Column(db.Enum("Running", "RanToCompletion"), default="Running")
    isAdminEdited = db.Column(db.Boolean, default=False)

    def __repr__(self):
        return f"<Task(id={self.id}, " \
               f"username=\"{self.username}\", " \
               f"email=\"{self.email}\", " \
               f"description=\"{self.description}\", " \
               f"status={self.status})>"
