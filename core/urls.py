from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import *
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register("assets", AssetViewSet, basename="asset")
router.register("inventory", InventoryViewSet, basename="inventory")
router.register("assignments", AssignmentViewSet, basename="assignment")
router.register("tickets", TicketViewSet, basename="ticket")

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/dashboard/", dashboard_stats, name="dashboard-stats"),

    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
