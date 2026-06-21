from django.db import models
from django.contrib.auth.models import User #this is so fucking OP last time you need to write a custom user model, but now you can just use the built in one and extend it with a profile model. This is so fucking OP. I love Django.


# Create your models here.

# First we want to handle 
class PDFDocument(models.Model): #models.Model because models is a module and Model is a class in that module.
                                 #This is how you create a model in Django. You inherit from models.Model and then define your fields as class attributes.  
    user = models.ForeignKey(User, on_delete=models.CASCADE) #this is a foreign key to the User model. This means that each PDFDocument is associated with a User Class (havent make yet). The on_delete=models.CASCADE means that if the User is deleted, the PDFDocument will also be deleted.
    title = models.CharField(max_length=255) #this is a char field with a max length of 255 characters. This will be the title of the PDF document.
    file = models.FileField(upload_to='pdfs/') #this is a file field that will upload the file to the 'pdfs/' directory; super sick that django. This will be the actual PDF file that the user uploads.
    uploaded_at = models.DateTimeField(auto_now_add=True) #this is a datetime field that will automatically set the value to the current date and time when the PDFDocument is created. This will be used to track when the PDF document was uploaded.  
    chunk_size = models.IntegerField(default=1000) #this is an integer field that will store the chunk size. This will be used to determine how many characters to include in each chunk when we split the PDF document into chunks. The default value is 1000 characters. This is a good starting point, but we can always change it later if we want to.  

    def __str__(self): #so when you query the PDFDocument model in the Django admin or in the shell, it will return the title of the PDF document instead of just "PDFDocument object (1)" or something like that. This is a good practice to make it easier to identify the objects in the database.
        return self.title


class DocumentChunk(models.Model): #this is a model that will store the chunks of the PDF document. This is so that we can store the chunks in the database and then retrieve them later when we want to answer questions about the PDF document. This is a very important part of the RAG pipeline.
    document = models.ForeignKey(PDFDocument, on_delete=models.CASCADE) #this is a foreign key to the PDFDocument model. This means that each DocumentChunk is associated with a PDFDocument. The on_delete=models.CASCADE means that if the PDFDocument is deleted, the DocumentChunk will also be deleted.
    content = models.TextField() #this is a text field that will store the content of the chunk. This will be the actual text that we will use to answer questions about the PDF document.
    chunk_index = models.IntegerField() #this is an integer field that will store the index of the chunk. This will be used to keep track of the order of the chunks in the PDF document. This is important because we want to be able to reconstruct the original PDF document from the chunks.
    embedding = models.JSONField() #this is a JSON field that will store the embedding of the chunk. This will be used to find the most relevant chunks when answering questions about the PDF document. The embedding will be generated using a language model and will be a vector representation of the content of the chunk. // next time then we try binaryfield to store the embedding as a binary file instead of a JSON field. This will be more efficient and will allow us to store larger embeddings. But for now, we will use a JSON field because it is easier to work with and we can always change it later.

    class Meta:
        ordering = ['chunk_index']

    def __str__(self):
        return f"{self.document.title} - Chunk {self.chunk_index}"