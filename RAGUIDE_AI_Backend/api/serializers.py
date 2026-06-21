from rest_framework import serializers
from .models import PDFDocument, DocumentChunk
# A serializer is:

# A DTO(data to object) + validation + conversion logic

class PDFDocumentSerializer(serializers.ModelSerializer):
    class Meta: #Settings for Serializer
        model = PDFDocument
        fields = ['id', 'user', 'title', 'file', 'uploaded_at', 'chunk_size']
        read_only_fields = ['user']

class DocumentChunkSerializer(serializers.ModelSerializer):
    class Meta:
        model = DocumentChunk
        fields = ['id', 'document', 'content', 'chunk_index', 'embedding']