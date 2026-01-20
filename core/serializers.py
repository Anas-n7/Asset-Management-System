from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Asset, Inventory, Assignment, Ticket

class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = "__all__"


class InventorySerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_category = serializers.CharField(source='asset.category', read_only=True)
    
    class Meta:
        model = Inventory
        fields = "__all__"
        read_only_fields = ['asset_name', 'asset_category']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class AssignmentSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_category = serializers.CharField(source='asset.category', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Assignment
        fields = "__all__"
        read_only_fields = ['asset_name', 'asset_category', 'user_username', 'user_email']


class TicketSerializer(serializers.ModelSerializer):
    asset_name = serializers.CharField(source='asset.name', read_only=True)
    asset_category = serializers.CharField(source='asset.category', read_only=True)
    
    class Meta:
        model = Ticket
        fields = "__all__"
        read_only_fields = ['asset_name', 'asset_category']
