from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import PDFDocument, DocumentChunk
from .serializers import PDFDocumentSerializer, DocumentChunkSerializer

# Create your views here.

class PDFDocumentViewSet(viewsets.ModelViewSet):
    queryset = PDFDocument.objects.all()
    serializer_class = PDFDocumentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return PDFDocument.objects.filter(user=self.request.user)

class DocumentChunkViewSet(viewsets.ModelViewSet):
    queryset = DocumentChunk.objects.all()
    serializer_class = DocumentChunkSerializer
    permission_classes = [permissions.IsAuthenticated]


### you need to understand this before you continue
    def get_queryset(self):
        # Only return chunks from documents the user owns
        return DocumentChunk.objects.filter(document__user=self.request.user)