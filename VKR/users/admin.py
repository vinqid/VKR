from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserSession


class UserAdmin(BaseUserAdmin):
    """Настройка отображения пользователя в админке"""
    list_display = ['username', 'email', 'role', 'is_staff', 'is_active']
    list_filter = ['role', 'is_staff', 'is_active']
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Персональная информация', {'fields': ('first_name', 'last_name', 'email', 'role')}),
        ('Права доступа', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Важные даты', {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role'),
        }),
    )
    search_fields = ['username', 'email']
    ordering = ['username']


@admin.register(UserSession)
class UserSessionAdmin(admin.ModelAdmin):
    """Настройка отображения сессий"""
    list_display = ['user', 'token', 'created_at', 'expires_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'token']
    readonly_fields = ['token', 'created_at']


# Регистрируем модели
admin.site.register(User, UserAdmin)
from django.contrib import admin

# Register your models here.
