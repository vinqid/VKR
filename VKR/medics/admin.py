from django.contrib import admin
from .models import Medic


@admin.register(Medic)
class MedicAdmin(admin.ModelAdmin):
    """Настройка отображения врачей"""
    list_display = ['name', 'specialty', 'work_place', 'get_username']
    list_filter = ['specialty']
    search_fields = ['name', 'specialty', 'work_place']

    def get_username(self, obj):
        return obj.user.username

    get_username.short_description = 'Логин'
    get_username.admin_order_field = 'user__username'


from django.contrib import admin

# Register your models here.
