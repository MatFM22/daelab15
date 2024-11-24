from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
# Register your models here.

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Campos que se mostrarán al editar un usuario existente
    fieldsets = UserAdmin.fieldsets + (
        ('Additional Info', {'fields': ('role',)}),  # Agregamos el campo 'role'
    )

    # Campos que se mostrarán al crear un usuario nuevo
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Info', {'fields': ('role',)}),  # Aseguramos que "role" esté al crear usuarios
    )

    # Configuración de las columnas visibles en la lista de usuarios
    list_display = ('username', 'email', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

