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
        detail = getattr(exc, 'detail', None)
        message = 'Validation or request error occurred.'
        if isinstance(detail, str):
            message = detail
        elif isinstance(detail, dict) and detail:
            first_val = next(iter(detail.values()))
            if isinstance(first_val, list) and first_val:
                message = str(first_val[0])
            else:
                message = str(first_val)
        elif isinstance(detail, list) and detail:
            message = str(detail[0])
        elif hasattr(exc, 'message') and exc.message:
            message = str(exc.message)

        custom_data = {
            'success': False,
            'error': {
                'code': error_code,
                'message': message,
                'details': response.data
            }
        }
        response.data = custom_data

    return response
