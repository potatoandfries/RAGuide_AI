import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../services/api';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  isRegister = false;
  username = '';
  password = '';
  email = '';
  error = '';

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  toggleMode() {
    this.isRegister = !this.isRegister;
    this.error = '';
  }

  submit() {
    this.error = '';
    if (this.isRegister) {
      this.api.register(this.username, this.password, this.email).subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = 'Registration failed. Try a different username.';
        }
      });
    } else {
      this.api.login(this.username, this.password).subscribe({
        next: (res) => {
          this.auth.saveToken(res.token);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.error = 'Invalid username or password.';
        }
      });
    }
  }
}
