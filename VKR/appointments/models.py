from django.db import models
from patients.models import MedicalCard
from medics.models import Medic


class MedicalAppointment(models.Model):
    """Приём у врача"""
    medical_card = models.ForeignKey(MedicalCard, on_delete=models.CASCADE, related_name='appointments')
    medic = models.ForeignKey(Medic, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateTimeField(verbose_name="Дата и время приёма")
    symptoms = models.TextField(verbose_name="Симптомы")
    diagnosis = models.TextField(verbose_name="Диагноз")
    tests = models.TextField(blank=True, verbose_name="Анализы")
    treatment = models.TextField(verbose_name="Лечение")
    recommendations = models.TextField(blank=True, verbose_name="Рекомендации")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создан")

    class Meta:
        verbose_name = "Приём"
        verbose_name_plural = "Приёмы"
        ordering = ['-date']

    def __str__(self):
        return f"Приём {self.id} от {self.date}"


from django.db import models

# Create your models here.
