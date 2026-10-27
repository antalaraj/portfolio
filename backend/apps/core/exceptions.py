from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    """
    Standardizes error responses to match our API contract:
    {
      "success": false,
      "error": {
        "code": "ERROR_CODE",
        "message": "Human readable message",
        "details": { ... }
      }
    }
    """
    response = exception_handler(exc, context)

    if response is not None:
        error_code = exc.__class__.__name__.upper()
        custom_data = {
            'success': False,
            'error': {
                'code': error_code,
                'message': getattr(exc, 'detail', str(exc)) if isinstance(getattr(exc, 'detail', None), str) else 'Validation or request error occurred.',
                'details': response.data
            }
        }
        response.data = custom_data

    return response
