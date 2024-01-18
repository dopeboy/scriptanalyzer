from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse
from django.http import JsonResponse
from rest_framework.response import Response
from .serializers import ScriptSerializer
from rest_framework import viewsets, status

from .models import Script, Comment


class ScriptViewSet(viewsets.ViewSet):
    def list(self, request):
        queryset = Script.objects.all().order_by("-created_on")
        serializer = ScriptSerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request):
        serializer = ScriptSerializer(data=request.data)

        if serializer.is_valid():
            script = Script.objects.create(**serializer.validated_data)
            return Response(ScriptSerializer(script).data, status=status.HTTP_201_CREATED)

        return Response(
            {"status": "Bad Request", "message": serializer.is_valid()},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def retrieve(self, request, pk=None):
        queryset = Script.objects.all()
        script = get_object_or_404(queryset, pk=pk)
        serializer = ScriptSerializer(script)
        return Response(serializer.data)

    def update(self, request, pk=None):
        pass

    def partial_update(self, request, pk=None):
        instance = Script.objects.get(pk=pk)
        serializer = ScriptSerializer(instance, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.validated_data, status=status.HTTP_201_CREATED)

        return Response(
            {"status": "Bad Request", "message": serializer.is_valid()},
            status=status.HTTP_400_BAD_REQUEST,
        )

    def destroy(self, request, pk=None):
        pass
