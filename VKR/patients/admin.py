from django.contrib import admin
from .models import Patient, MedicalCard


class MedicalCardInline(admin.StackedInline):
    """Встраиваем медкарту прямо в страницу пациента"""
    model = MedicalCard
    can_delete = False
    verbose_name_plural = 'Медицинская карта'


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """Настройка отображения пациентов"""
    list_display = ['name', 'sex', 'birth_date', 'get_username', 'get_medics_count']
    list_filter = ['sex']
    search_fields = ['name', 'user__username']
    inlines = [MedicalCardInline]

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Логин'

    def get_medics_count(self, obj):
        return obj.medics.count()

    get_medics_count.short_description = 'Количество врачей'


@admin.register(MedicalCard)
class MedicalCardAdmin(admin.ModelAdmin):
    """Настройка отображения медкарт"""
    list_display = ['patient', 'height', 'weight', 'blood_type', 'rh_factor']
    list_filter = ['blood_type', 'rh_factor']
    search_fields = ['patient__name']


from django.contrib import admin

# Register your models here.
