from django.contrib import admin
from .models import Client, Provider, Invoice

# Register your models here.

# Registrar el modelo de clientes
@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')  # Columnas visibles en el listado
    search_fields = ('name', 'email')  # Campos para buscar

# Registrar el modelo de proveedores
@admin.register(Provider)
class ProviderAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at')
    search_fields = ('name', 'email')

# Registrar el modelo de facturas
@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('number', 'client', 'provider', 'issue_date', 'due_date', 'total_amount', 'status')
    list_filter = ('status', 'issue_date', 'due_date')  # Filtros laterales
    search_fields = ('number', 'client__name', 'provider__name')  # Campos para buscar
    date_hierarchy = 'issue_date'  # Navegación por fechas