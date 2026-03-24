from django.db import models
from patients.models import Patient, MedicalCard
from medics.models import Medic


class MonitoredParameter(models.Model):
    """Отслеживаемый параметр (например, давление, пульс)"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")

    class Meta:
        verbose_name = "Отслеживаемый параметр"
        verbose_name_plural = "Отслеживаемые параметры"

    def __str__(self):
        return self.name


class Questionnaire(models.Model):
    """Анкета для мониторинга состояния"""
    STATUS_CHOICES = [
        ('sent_to_patient', 'Отправлена пациенту'),
        ('sent_to_medic', 'Отправлена врачу'),
        ('answered', 'Принята'),
        ('denied', 'Отклонена'),
    ]

    medical_card = models.ForeignKey(MedicalCard, on_delete=models.CASCADE, related_name='questionnaires')
    medic = models.ForeignKey(Medic, on_delete=models.CASCADE, related_name='questionnaires')
    date = models.DateField(verbose_name="Дата анкетирования")
    parameters = models.ManyToManyField(MonitoredParameter, related_name='questionnaires', verbose_name="Параметры")
    optional = models.TextField(blank=True, verbose_name="Комментарий пациента")
    result = models.IntegerField(default=0, verbose_name="Результат оценки")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='sent_to_patient', verbose_name="Статус")
    medics_respond = models.TextField(blank=True, verbose_name="Комментарий врача")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Создана")

    class Meta:
        verbose_name = "Анкета"
        verbose_name_plural = "Анкеты"
        ordering = ['-date']

    def __str__(self):
        return f"Анкета {self.id} от {self.date}"


class PatientResponse(models.Model):
    """Ответ пациента на параметр в анкете"""
    response = models.CharField(max_length=255, verbose_name="Ответ")
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, related_name='patient_responses')
    parameter = models.ForeignKey(MonitoredParameter, on_delete=models.CASCADE, verbose_name="Параметр")

    class Meta:
        verbose_name = "Ответ пациента"
        verbose_name_plural = "Ответы пациентов"
        unique_together = ['questionnaire', 'parameter']  # Один ответ на параметр в анкете

    def __str__(self):
        return f"{self.parameter.name}: {self.response}"


from django.db import models

# Create your models here.
