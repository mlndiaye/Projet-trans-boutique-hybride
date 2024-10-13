# models.py
from django.db import models
from django.urls import reverse


from django.conf import settings

class Category(models.Model):
    id_category = models.AutoField(primary_key=True)
    name_category = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self) -> str:
        return self.name_category