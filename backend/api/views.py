import json

from django.shortcuts import get_object_or_404, render
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import ScriptSerializer
from rest_framework import viewsets, status
from openai import OpenAI
from .models import Script, Comment
from django.conf import settings


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
        print(serializer.data)
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
    
    @action(detail=True, methods=['POST'], name='Process script')
    def process(self, request, *args, **kwargs):
        script = Script.objects.get(pk=kwargs['pk'])

        # Delete all comments attached to Script
        script.comments.all().delete()

        # print(script.structured_text)
        # print(script.unstructured_text) 

        client = OpenAI(
          api_key=settings.OPENAI_KEY
        )

        idx = 1
        for line in script.unstructured_text.splitlines():
            line = line.strip()
            
            print(line)
            # print(idx)
            # print(idx+len(line))

            if line:
                response = client.chat.completions.create(
                  model="gpt-3.5-turbo",
                  messages=[
                    {
                      "role": "system",
                      "content": f"The following content is from a script for a tv show. Can you perform production clearance on it to ensure it doesn't contain any references to brands, public figures, etc. Do not correct it, just point out what's wrong with it and explain why:\n\n{line}"
                    },
                  ],
                  temperature=0.7,
                  max_tokens=256,
                  top_p=1
                )
                print(response.choices[0].message.content)
            
                Comment.objects.create(
                    script=script,
                    text=response.choices[0].message.content,
                    start_index=idx,
                    source_text=line,
                    end_index=idx+len(line)
                )
                idx = idx+len(line)+1
            else:
                idx = idx+1
            
        
        return Response(status=status.HTTP_200_OK)