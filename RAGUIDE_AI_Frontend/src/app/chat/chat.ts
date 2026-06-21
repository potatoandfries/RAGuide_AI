import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthService } from '../services/auth';
import { ApiService, PDFDocument } from '../services/api';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterModule, FormsModule, DatePipe],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit {
  prompt = '';
  messages: { role: string; text: string }[] = [];

  // Document upload
  documents: PDFDocument[] = [];
  selectedFile: File | null = null;
  uploading = false;
  error = '';
  loading = true;

  constructor(
    private auth: AuthService,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.loading = true;
    this.api.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load documents.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0] || null;
  }

  upload() {
    if (!this.selectedFile) return;
    this.uploading = true;
    this.error = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('title', this.selectedFile.name);

    this.api.uploadDocument(formData).subscribe({
      next: () => {
        this.uploading = false;
        const fileName = this.selectedFile?.name || 'file';
        this.selectedFile = null;
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput) fileInput.value = '';
        this.loadDocuments();
        // Show a system message that a document was uploaded
        this.messages.push({
          role: 'assistant',
          text: `📄 Document "${fileName}" uploaded successfully.`
        });
      },
      error: () => {
        this.uploading = false;
        this.error = 'Upload failed. Make sure the backend server is running.';
      }
    });
  }

  deleteDoc(id: number) {
    // Optimistically remove from UI immediately to prevent double-clicks
    this.documents = this.documents.filter(d => d.id !== id);
    this.api.deleteDocument(id).subscribe({
      next: () => {
        // Refresh to ensure server state matches
        this.loadDocuments();
      },
      error: (err) => {
        // If 404, the doc was already deleted — just refresh
        if (err.status === 404) {
          this.loadDocuments();
        } else {
          this.error = 'Delete failed.';
          this.loadDocuments();
        }
      }
    });
  }

  send() {
    if (!this.prompt.trim()) return;

    this.messages.push({ role: 'user', text: this.prompt });
    // For now, just echo back — backend RAG endpoint will go here later
    this.messages.push({ role: 'assistant', text: `You asked: "${this.prompt}" — RAG response coming soon!` });
    this.prompt = '';
  }

  logout() {
    this.auth.logout();
  }
}
