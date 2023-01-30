import logging
from typing import List, Literal
from sqlalchemy.exc import IntegrityError, NoResultFound
from app.task.models import Task
from app import db

logger = logging.getLogger(__name__)


class TaskService:
    @staticmethod
    def get_tasks(page: int, task_per_page: int, sort_by: Literal['username', 'status', 'email'], is_desc: bool = False) -> List[Task]:
        if sort_by not in ('username', 'status', 'email'):
            raise ValueError("Invalid sort_by parameter. Must be one of 'username', 'status', 'email'.")

        query = Task.query
        if sort_by == 'username':
            query = query.order_by(Task.username.desc() if is_desc else Task.username)
        elif sort_by == 'status':
            query = query.order_by(Task.status.desc() if is_desc else Task.status)
        elif sort_by == 'email':
            query = query.order_by(Task.email.desc() if is_desc else Task.email)
        else:
            query = query.order_by(Task.username.desc() if is_desc else Task.username)

        query = query.limit(task_per_page).offset(page*task_per_page)
        return query.all()

    @staticmethod
    def get_total_tasks() -> int:
        return Task.query().count()

    @staticmethod
    def create_task(task_data: dict) -> Task:
        try:
            task = Task(username=task_data['username'], email=task_data['email'], description=task_data['description'])
            db.session.add(task)
            db.session.commit()
            return task
        except IntegrityError as e:
            logger.error(str(e))
            db.session.rollback()
            raise e

    @staticmethod
    def edit_task(task_id: int, task_description: str) -> Task:
        try:
            task = Task.query.filter_by(id=task_id).one()
            task.description = task_description
            task.isAdminEdited = True
            db.session.commit()
            return task
        except NoResultFound as e:
            logger.error(str(e))
            raise ValueError(f"Task with id {task_id} not found.")
        except IntegrityError as e:
            logger.error(str(e))
            db.session.rollback()
            raise e

    @staticmethod
    def completed_task(task_id: int) -> Task:
        try:
            task = Task.query.filter_by(id=task_id).one()
            task.status = "RanToCompletion"
            db.session.commit()
            return task
        except NoResultFound as e:
            logger.error(str(e))
            raise ValueError(f"Task with id {task_id} not found.")
        except IntegrityError as e:
            logger.error(str(e))
            db.session.rollback()
            raise e
