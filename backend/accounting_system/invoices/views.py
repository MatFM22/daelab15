from django.shortcuts import render

from rest_framework import viewsets
from .models import Client, Provider, Invoice
from .serializers import ClientSerializer, ProviderSerializer, InvoiceSerializer

#-----------------------↓2
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Invoice
from django.db.models import Sum, Count
from datetime import date
from rest_framework.permissions import AllowAny

#------------------------↓3
from datetime import date, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Invoice

# Create your views here.

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ProviderViewSet(viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

#--------------------↓2
class DashboardMetricsView(APIView):
    permission_classes = [AllowAny]  # Permitir acceso sin autenticación

    def get(self, request):
        # Total por cobrar
        total_por_cobrar = Invoice.objects.filter(client__isnull=False).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Total por pagar
        total_por_pagar = Invoice.objects.filter(provider__isnull=False).aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Facturas vencidas
        facturas_vencidas = Invoice.objects.filter(due_date__lt=date.today(), status='pending')
        total_vencido = facturas_vencidas.aggregate(Sum('total_amount'))['total_amount__sum'] or 0
        
        # Facturas por mes
        facturas_por_mes = Invoice.objects.values('issue_date__month').annotate(total=Sum('total_amount')).order_by('issue_date__month')

        return Response({
            'total_por_cobrar': total_por_cobrar,
            'total_por_pagar': total_por_pagar,
            'total_vencido': total_vencido,
            'facturas_por_mes': list(facturas_por_mes),
        })

#----------------------------↓3
class NotificationView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Fecha actual
        today = date.today()
        three_days_later = today + timedelta(days=3)

        # Facturas próximas a vencer
        proximas_a_vencer = Invoice.objects.filter(
            due_date__range=(today, three_days_later),
            status="pending"
        ).values("number", "client__name", "due_date")

        # Facturas vencidas
        vencidas = Invoice.objects.filter(
            due_date__lt=today,
            status="pending"
        ).values("number", "client__name", "due_date")

        return Response({
            "proximas_a_vencer": list(proximas_a_vencer),
            "vencidas": list(vencidas),
        })