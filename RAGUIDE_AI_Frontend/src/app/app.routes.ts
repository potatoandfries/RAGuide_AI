import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Chat } from './chat/chat';
import { AuthGuard } from './services/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'chat', component: Chat, canActivate: [AuthGuard] },
  // Dashboard is now merged into Chat — redirect any old /dashboard links to /chat
  { path: 'dashboard', redirectTo: '/chat', pathMatch: 'full' },
];
