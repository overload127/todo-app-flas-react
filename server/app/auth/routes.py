import hashlib
import logging
from datetime import datetime, timezone, timedelta
from flask import Blueprint, current_app, request
from flask_jwt_extended import jwt_required
from flask_jwt_extended import create_access_token, create_refresh_token, get_jwt_identity, get_jwt
from flask_jwt_extended import set_access_cookies, set_refresh_cookies, unset_jwt_cookies

from app.utils.response import ApiResponse

logger = logging.getLogger(__name__)
auth_blueprint = Blueprint('auth', __name__)


@auth_blueprint.route('/auth', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)

    if username is None or password is None:
        return ApiResponse.unauthorized(None, 'Bad login or password')

    hash_password = hashlib.md5(password.encode('utf-8')).hexdigest()
    if (username != current_app.config.get('ADMIN_LOGIN', 'admin') or
        hash_password != current_app.config.get('ADMIN_PASSWORD_MD5', '')):
        return ApiResponse.unauthorized('Bad username or password')

    access_token = create_access_token(identity="admin_id", fresh=True)
    refresh_token = create_refresh_token(identity="admin_id")

    response = ApiResponse.success(None, 'login')
    set_access_cookies(response[0], access_token)
    set_refresh_cookies(response[0], refresh_token)
    return response


@auth_blueprint.route('/logout', methods=['POST'])
def logout():
    response = ApiResponse.success(None, 'logout successful')
    unset_jwt_cookies(response[0])
    return response


@auth_blueprint.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)

    response = ApiResponse.success(None, 'refresh')
    set_access_cookies(response[0], access_token)
    return response


@current_app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()['exp']
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError) as e:
        logger.error(str(e))
        return response
