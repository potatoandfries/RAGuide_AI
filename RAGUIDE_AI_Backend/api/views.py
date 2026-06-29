from django.contrib.auth.models import User
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from .models import PDFDocument, DocumentChunk
from .serializers import PDFDocumentSerializer, DocumentChunkSerializer

# Create your views here.

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, password=password, email=email)
    token, _ = Token.objects.get_or_create(user=user)
    return Response({'token': token.key}, status=status.HTTP_201_CREATED)

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
