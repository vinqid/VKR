from django.db import models

# Create your models here.
from django.db import models
from users.models import User
from medics.models import Medic


class Patient(models.Model):
    """Профиль пациента"""
    SEX_CHOICES = [
        ('M', 'Мужской'),
        ('F', 'Женский'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    name = models.CharField(max_length=100, verbose_name="ФИО")
    birth_date = models.DateField(verbose_name="Дата рождения")
    sex = models.CharField(max_length=1, choices=SEX_CHOICES, verbose_name="Пол")
    medics = models.ManyToManyField(Medic, related_name='patients', blank=True, verbose_name="Врачи")

    class Meta:
        verbose_name = "Пациент"
        verbose_name_plural = "Пациенты"

    def __str__(self):
        return self.name


class MedicalCard(models.Model):
    """Медицинская карта пациента"""
    BLOOD_TYPE_CHOICES = [
        ('O+', 'O+'), ('O-', 'O-'),
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
    ]

    patient = models.OneToOneField(Patient, on_delete=models.CASCADE, related_name='medical_card')
    height = models.FloatField(null=True, blank=True, verbose_name="Рост (см)")
    weight = models.FloatField(null=True, blank=True, verbose_name="Вес (кг)")
    blood_type = models.CharField(max_length=3, choices=BLOOD_TYPE_CHOICES, null=True, blank=True,
                                  verbose_name="Группа крови")
    rh_factor = models.BooleanField(null=True, blank=True, verbose_name="Резус-фактор (положительный)")
    chronic_diseases = models.TextField(blank=True, verbose_name="Хронические заболевания")
    allergies = models.TextField(blank=True, verbose_name="Аллергии")

    class Meta:
        verbose_name = "Медицинская карта"
        verbose_name_plural = "Медицинские карты"

    def __str__(self):
        return f"Медкарта {self.patient.name}"