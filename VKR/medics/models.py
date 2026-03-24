from django.db import models
from users.models import User


class Medic(models.Model):
    """Профиль врача"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='medic_profile')
    name = models.CharField(max_length=100, verbose_name="ФИО")
    specialty = models.CharField(max_length=100, verbose_name="Специальность")
    education = models.TextField(verbose_name="Образование")
    work_place = models.CharField(max_length=200, verbose_name="Место работы")

    class Meta:
        verbose_name = "Врач"
        verbose_name_plural = "Врачи"

    def __str__(self):
        return f"{self.name} ({self.specialty})"


from django.db import models

# Create your models here.
