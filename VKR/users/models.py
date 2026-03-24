from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Расширенная модель пользователя"""
    ROLE_CHOICES = [
        ('medic', 'Врач'),
        ('patient', 'Пациент'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, verbose_name="Роль")

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователи"

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class UserSession(models.Model):
    """Сессия пользователя (для токенов)"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sessions')
    token = models.CharField(max_length=255, unique=True, verbose_name="Токен")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создана")
    expires_at = models.DateTimeField(verbose_name="Истекает")

    class Meta:
        verbose_name = "Сессия"
        verbose_name_plural = "Сессии"

    def __str__(self):
        return f"Сессия {self.user.username}"


from django.db import models

# Create your models here.
