from django.db import models
from django.contrib.auth.models import User

class Asset(models.Model):
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=100)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Inventory(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    quantity = models.IntegerField()


class Assignment(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    assigned_on = models.DateField(auto_now_add=True)


class Ticket(models.Model):
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE)
    issue = models.TextField()
    status = models.CharField(max_length=20, default="open")