import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface PDFDocument {
  id: number;
  user: number;
  title: string;
  file: string;
  uploaded_at: string;
  chunk_size: number;
}

export interface DocumentChunk {
  id: number;
  document: number;
  content: string;
  chunk_index: number;
  embedding: number[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': token ? `Token ${token}` : '',
    });
  }

  // Auth - uses DRF's obtain_auth_token endpoint
  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/auth/token/`, { username, password });
  }

  register(username: string, password: string, email: string) {
    // DRF doesn't have a built-in registration endpoint, so we create the user via the admin-like API
    return this.http.post<{ token: string }>(`${this.baseUrl}/api/auth/register/`, { username, password, email });
  }

  logout() {
    // Token-based auth: just remove the token on the client side
    return this.http.post(`${this.baseUrl}/api/auth/logout/`, {}, { headers: this.getHeaders() });
  }

  // PDF Documents
  getDocuments() {
    return this.http.get<PDFDocument[]>(`${this.baseUrl}/api/documents/`, { headers: this.getHeaders() });
  }

  uploadDocument(formData: FormData) {
    return this.http.post<PDFDocument>(`${this.baseUrl}/api/documents/`, formData, { headers: this.getHeaders() });
  }

  deleteDocument(id: number) {
    return this.http.delete(`${this.baseUrl}/api/documents/${id}/`, { headers: this.getHeaders() });
  }

  // Document Chunks
  getChunks(documentId: number) {
    return this.http.get<DocumentChunk[]>(`${this.baseUrl}/api/chunks/?document=${documentId}`, { headers: this.getHeaders() });
  }
}
