import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';
import { ApiService, PDFDocument } from '../services/api';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  documents: PDFDocument[] = [];
  selectedFile: File | null = null;
  uploading = false;
  error = '';

  constructor(
    private api: ApiService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.loadDocuments();
  }

  loadDocuments() {
    this.api.getDocuments().subscribe({
      next: (docs) => this.documents = docs,
      error: () => this.error = 'Failed to load documents.'
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
        this.selectedFile = null;
        this.loadDocuments();
      },
      error: () => {
        this.uploading = false;
        this.error = 'Upload failed.';
      }
    });
  }

  deleteDoc(id: number) {
    this.api.deleteDocument(id).subscribe({
      next: () => this.loadDocuments(),
      error: () => this.error = 'Delete failed.'
    });
  }

  logout() {
    this.auth.logout();
  }
}
