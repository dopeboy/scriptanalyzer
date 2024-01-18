from django.db import models
from django.utils import timezone


class Script(models.Model):
    name = models.CharField(max_length=128)
    text = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)


class Comment(models.Model):
    script = models.ForeignKey(Script, on_delete=models.CASCADE)
    text = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
