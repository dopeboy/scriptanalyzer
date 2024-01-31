from django.db import models
from django.utils import timezone


class Script(models.Model):
    name = models.CharField(max_length=128)
    structured_text = models.TextField()
    unstructured_text = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)


class Comment(models.Model):
    script = models.ForeignKey(Script, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    source_text = models.TextField()
    created_on = models.DateTimeField(default=timezone.now)
    start_index = models.IntegerField()
    end_index = models.IntegerField()
