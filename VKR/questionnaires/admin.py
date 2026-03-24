from django.contrib import admin
from .models import MonitoredParameter, Questionnaire, PatientResponse


@admin.register(MonitoredParameter)
class MonitoredParameterAdmin(admin.ModelAdmin):
    """Настройка отображения параметров"""
    list_display = ['name', 'description']
    search_fields = ['name']


class PatientResponseInline(admin.TabularInline):
    """Встраиваем ответы прямо в анкету"""
    model = PatientResponse
    extra = 1
    verbose_name_plural = 'Ответы пациента'


@admin.register(Questionnaire)
class QuestionnaireAdmin(admin.ModelAdmin):
    """Настройка отображения анкет"""
    list_display = ['id', 'patient_name', 'medic_name', 'date', 'status', 'result']
    list_filter = ['status', 'date']
    search_fields = ['medical_card__patient__name', 'medic__name']
    inlines = [PatientResponseInline]
    readonly_fields = ['result']

    def patient_name(self, obj):
        return obj.medical_card.patient.name

    patient_name.short_description = 'Пациент'

    def medic_name(self, obj):
        return obj.medic.name

    medic_name.short_description = 'Врач'


@admin.register(PatientResponse)
class PatientResponseAdmin(admin.ModelAdmin):
    """Настройка отображения ответов"""
    list_display = ['questionnaire', 'parameter', 'response']
    list_filter = ['parameter']
    search_fields = ['questionnaire__id', 'parameter__name']


from django.contrib import admin

# Register your models here.
