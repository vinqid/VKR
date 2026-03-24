from django.contrib import admin
from .models import MedicalAppointment


@admin.register(MedicalAppointment)
class MedicalAppointmentAdmin(admin.ModelAdmin):
    """Настройка отображения приёмов"""
    list_display = ['id', 'patient_name', 'medic_name', 'date', 'diagnosis']
    list_filter = ['date', 'medic']
    search_fields = ['medical_card__patient__name', 'medic__name', 'diagnosis']
    readonly_fields = ['created_at']

    def patient_name(self, obj):
        return obj.medical_card.patient.name

    patient_name.short_description = 'Пациент'

    def medic_name(self, obj):
        return obj.medic.name

    medic_name.short_description = 'Врач'


from django.contrib import admin

# Register your models here.
