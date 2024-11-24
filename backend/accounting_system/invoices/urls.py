from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, ProviderViewSet, InvoiceViewSet

from django.urls import path
from .views import DashboardMetricsView, NotificationView

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'providers', ProviderViewSet)
router.register(r'invoices', InvoiceViewSet)

urlpatterns = router.urls 

urlpatterns += [
    path('dashboard-metrics/', DashboardMetricsView.as_view(), name='dashboard-metrics'),
    path('notifications/', NotificationView.as_view(), name='notifications'),
]