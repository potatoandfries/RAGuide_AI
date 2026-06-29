from django.contrib import admin
from .models import PDFDocument, DocumentChunk

@admin.register(PDFDocument)
class PDFDocumentAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'title', 'uploaded_at', 'chunk_size']

@admin.register(DocumentChunk)
class DocumentChunkAdmin(admin.ModelAdmin):
    list_display = ['id', 'document', 'chunk_index', 'content']
