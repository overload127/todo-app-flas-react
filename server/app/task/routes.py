import logging
from flask import request, Blueprint
from marshmallow import ValidationError
from sqlalchemy.exc import IntegrityError, NoResultFound
from flask_jwt_extended import jwt_required

from app.utils.response import ApiResponse
from app.task.models import Task
from app.task.schemas import TaskSchema
from app.task.service import TaskService


logger = logging.getLogger(__name__)
task_blueprint = Blueprint('task', __name__)

TASK_PER_PAGE = 3


@task_blueprint.route("", methods=["GET"])
def get_tasks():
    page = request.args.get('page', 0, type=int)
    sort_by = request.args.get('sort_by', 'username', type=str)
    is_desc = request.args.get('is_desc', 0, type=int)
    tasks_schema = TaskSchema(many=True)
    try:
        object_data = TaskService.get_tasks(page, TASK_PER_PAGE, sort_by, bool(is_desc))
        data = tasks_schema.dump(object_data)
        total = Task.query.count()
        payload = {
            "task_per_page": TASK_PER_PAGE,
            "current_page": page,
            "sort_by": sort_by,
            "is_desc": is_desc,
            "total_task": total,
            "data": data,
        }
        return ApiResponse.success(payload, "")
    except ValueError as e:
        logger.warning(str(e))
        return ApiResponse.error(str(e))
    except Exception as e:
        logger.error(str(e))
        return ApiResponse.error("Failed to retrieve all tasks")


@task_blueprint.route("", methods=["POST"])
def create_task():
    try:
        parameter = {
            'username': request.json.get('username'),
            'email': request.json.get('email'),
            'description': request.json.get('description'),
        }
        task_schema = TaskSchema()
        task_data = task_schema.load(parameter)
    except KeyError as e:
        logger.warning(str(e))
        return ApiResponse.validation_error("Missing required parameter", str(e))
    except ValidationError as e:
        logger.warning(str(e))
        return ApiResponse.validation_error("Validation Error", e.messages)

    try:
        task = TaskService.create_task(task_data)
        payload = task_schema.dump(task)
        return ApiResponse.success(payload, "")
    except IntegrityError as e:
        logger.error(str(e))
        return ApiResponse.error("Integrity Error")


@task_blueprint.route("", methods=["PUT"])
@jwt_required()
def edit_task():
    try:
        task_id = request.json.get('id')
        task_description = request.json.get('description')
    except KeyError as e:
        logger.warning(str(e))
        return ApiResponse.validation_error("Missing required parameter", str(e))
    
    try:
        task = TaskService.edit_task(task_id, task_description)
        task_schema = TaskSchema()
        payload = task_schema.dump(task)
        return ApiResponse.success(payload, "Task updated successfully")
    except NoResultFound:
        logger.error(str(e))
        return ApiResponse.error("Task not found")
    except Exception as e:
        logger.error(str(e))
        return ApiResponse.error("Failed to update task")


@task_blueprint.route("/completed", methods=["PUT"])
@jwt_required()
def completed_task():
    try:
        task_id = request.json.get('id')
    except KeyError as e:
        logger.warning(str(e))
        return ApiResponse.validation_error("Missing required parameter", str(e))
    
    try:
        task = TaskService.completed_task(task_id)
        task_schema = TaskSchema()
        payload = task_schema.dump(task)
        return ApiResponse.success(payload, "Task completed")
    except NoResultFound:
        logger.error(str(e))
        return ApiResponse.error("Task not found")
    except Exception as e:
        logger.error(str(e))
        return ApiResponse.error("Failed to update task")
