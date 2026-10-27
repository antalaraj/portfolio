from rest_framework import permissions

class IsSuperAdminUser(permissions.BasePermission):
    """
    Allows access only to authenticated superusers/staff.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Allows safe methods (GET, HEAD, OPTIONS) to anyone;
    write methods require authenticated superadmin.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser))
