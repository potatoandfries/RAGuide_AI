import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat {
  prompt = '';
  messages: { role: string; text: string }[] = [];

  constructor(private auth: AuthService) {}

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
