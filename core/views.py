from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend, FilterSet
from django.db.models import Q, Count, Sum
from datetime import datetime, timedelta
from .models import Asset, Inventory, Assignment, Ticket
from .serializers import (
    AssetSerializer, InventorySerializer, AssignmentSerializer, 
    TicketSerializer
)

class AssetFilter(FilterSet):
    class Meta:
        model = Asset
        fields = ["category", "available"]

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    filterset_class = AssetFilter
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['name', 'category']
    ordering_fields = ['name', 'category', 'available']
    ordering = ['-id']
    permission_classes = [permissions.IsAuthenticated]

class InventoryViewSet(viewsets.ModelViewSet):
    queryset = Inventory.objects.select_related('asset').all()
    serializer_class = InventorySerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['asset__name', 'asset__category']
    ordering_fields = ['quantity', 'asset__name']
    ordering = ['-id']
    permission_classes = [permissions.IsAuthenticated]

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.select_related('asset', 'user').all()
    serializer_class = AssignmentSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['asset__name', 'user__username', 'user__email']
    ordering_fields = ['assigned_on', 'asset__name']
    ordering = ['-assigned_on']
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if not self.request.user.is_staff:
            queryset = queryset.filter(user=self.request.user)
        return queryset

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.select_related('asset').all()
    serializer_class = TicketSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ['asset__name', 'issue', 'status']
    ordering_fields = ['status', 'asset__name']
    ordering = ['-id']
    permission_classes = [permissions.IsAuthenticated]

@api_view(["GET"])
def dashboard_stats(request):
    if not request.user.is_authenticated:
        return Response({"detail": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)
    
    total_assets = Asset.objects.count()
    available_assets = Asset.objects.filter(available=True).count()
    unavailable_assets = total_assets - available_assets
    total_tickets = Ticket.objects.count()
    open_tickets = Ticket.objects.filter(status='open').count()
    closed_tickets = Ticket.objects.filter(status='closed').count()
    total_assignments = Assignment.objects.count()
    total_inventory = Inventory.objects.aggregate(total=Sum('quantity'))['total'] or 0
    
    category_stats = Asset.objects.values('category').annotate(
        count=Count('id'),
        available_count=Count('id', filter=Q(available=True))
    )
    
    ticket_status_stats = Ticket.objects.values('status').annotate(count=Count('id'))
    
    seven_days_ago = datetime.now().date() - timedelta(days=7)
    recent_assignments = Assignment.objects.filter(assigned_on__gte=seven_days_ago).count()
    
    return Response({
        "overview": {
            "total_assets": total_assets,
            "available_assets": available_assets,
            "unavailable_assets": unavailable_assets,
            "total_tickets": total_tickets,
            "open_tickets": open_tickets,
            "closed_tickets": closed_tickets,
            "total_assignments": total_assignments,
            "total_inventory": total_inventory,
            "recent_assignments": recent_assignments,
        },
        "category_stats": list(category_stats),
        "ticket_status_stats": list(ticket_status_stats),
    })
