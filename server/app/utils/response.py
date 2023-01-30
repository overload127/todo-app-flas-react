from flask import jsonify


class ApiResponse:
    @staticmethod
    def success(data, message=None, status=200):
        return jsonify({
            'message': message or '',
            'payload': data
        }), status

    @staticmethod
    def error(message, error=None, status=500):
        return jsonify({
            'message': message,
            'payload': None
        }), status

    @staticmethod
    def validation_error(message, error=None, status=400):
        return jsonify({
            'message': message,
            'payload': error
        }), status

    @staticmethod
    def unauthorized(message, error=None, status=401):
        return jsonify({
            'message': message,
            'payload': error
        }), status
