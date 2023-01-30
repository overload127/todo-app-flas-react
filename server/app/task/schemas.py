from app import ma
from app.task.models import Task


class TaskSchema(ma.SQLAlchemyAutoSchema):
    """Schema for model Task"""
    class Meta:
        model = Task
