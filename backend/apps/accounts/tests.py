from django.test import TestCase
from django.contrib.auth import get_user_model, authenticate
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class ChangePasswordTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser(
            username="rajantala",
            email="antalaraj214@gmail.com",
            password="InitialPassword123!"
        )

    def test_unauthenticated_cannot_change_password(self):
        res = self.client.post("/api/v1/auth/change-password/", {
            "new_password": "NewSecretPassword2026!",
            "confirm_password": "NewSecretPassword2026!"
        }, format="json")
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_password_mismatch_fails(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post("/api/v1/auth/change-password/", {
            "new_password": "NewSecretPassword2026!",
            "confirm_password": "DifferentPassword2026!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("confirm_password", str(res.data))

    def test_short_password_fails(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post("/api/v1/auth/change-password/", {
            "new_password": "short",
            "confirm_password": "short"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_incorrect_current_password_fails(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post("/api/v1/auth/change-password/", {
            "current_password": "WrongCurrentPassword!",
            "new_password": "NewSecretPassword2026!",
            "confirm_password": "NewSecretPassword2026!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Current password is incorrect", str(res.data))

    def test_admin_direct_reset_success(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post("/api/v1/auth/change-password/", {
            "new_password": "NewSecretPassword2026!",
            "confirm_password": "NewSecretPassword2026!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data.get("success"))

        # Verify authentication works with new password and fails with old password
        self.admin.refresh_from_db()
        self.assertTrue(self.admin.check_password("NewSecretPassword2026!"))
        self.assertFalse(self.admin.check_password("InitialPassword123!"))

    def test_admin_with_valid_current_password_success(self):
        self.client.force_authenticate(user=self.admin)
        res = self.client.post("/api/v1/auth/change-password/", {
            "current_password": "InitialPassword123!",
            "new_password": "AnotherSecretPassword2026!",
            "confirm_password": "AnotherSecretPassword2026!"
        }, format="json")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data.get("success"))

        self.admin.refresh_from_db()
        self.assertTrue(self.admin.check_password("AnotherSecretPassword2026!"))
