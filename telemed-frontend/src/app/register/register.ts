import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class Register {
  userData = {
    username: '',
    password: '',
    email: '',
    role: 'patient' as 'medic' | 'patient',
    birth_date: ''
  };
  error = '';
  loading = false;
  success = false; 

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.error = '';
    
    if (!this.userData.username || !this.userData.password) {
      this.error = 'Заполните логин и пароль';
      return;
    }

    this.loading = true;

    // 1. Регистрация
    this.api.register(this.userData).subscribe({
      next: (response) => {
        console.log('Регистрация успешна', response);
        
        // 2. Автоматический вход
        this.api.login({
          username: this.userData.username,
          password: this.userData.password
        }).subscribe({
          next: (loginResponse) => {
            // 3. Сохраняем токены
            this.tokenService.setTokens(loginResponse.access, loginResponse.refresh);
            this.tokenService.setUser(loginResponse.user, loginResponse.access);
            
            const role = this.tokenService.getUserRole();
            if (!role) {
              this.error = 'Не удалось определить роль пользователя. Проверьте данные аккаунта.';
              this.tokenService.logout();
              this.loading = false;
              return;
            }
            
            // 4. Проверяем профиль и редиректим
            this.api.checkProfileFilled(role).subscribe({
              next: (status) => {
                if (status.filled) {
                  this.router.navigate([`/${role}-dashboard`]);
                } else {
                  this.router.navigate(['/profile/edit']);
                }
              },
              error: () => {
                this.router.navigate([`/${role}-dashboard`]);
              }
            });
          },
          error: (err) => {
            console.error('Ошибка автовхода:', err);
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Ошибка регистрации:', err);
        this.error = 'Ошибка регистрации. Возможно, логин уже занят';
        this.loading = false;
      }
    });
  }
}
