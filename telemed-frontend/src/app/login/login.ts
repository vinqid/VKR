import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { TokenService } from '../services/token.service';
import { CommonModule } from '@angular/common';        // для *ngIf
import { FormsModule } from '@angular/forms';          // для ngModel, ngSubmit
import { Router, RouterLink } from '@angular/router'; 

@Component({
  selector: 'app-login',
  standalone: true,                                     // важно!
  imports: [CommonModule, FormsModule, RouterLink],                 // добавить
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  username = '';
  password = '';
  error = '';
  loading = false;

  constructor(
    private api: ApiService,
    private tokenService: TokenService,
    private router: Router  // добавить
  ) {}

  onSubmit(): void {
    this.error = '';

    if (!this.username || !this.password) {
      this.error = 'Заполните все поля';
      return;
    }
    this.loading = true;

    this.api.login({username: this.username, password: this.password}).subscribe({
    next: (response) => {
      // Сохраняем токены
      this.tokenService.setTokens(response.access, response.refresh);
      
      // Сохраняем данные пользователя (для проверки роли)
      this.tokenService.setUser(response.user, response.access);
      
      const role = this.tokenService.getUserRole();
      if (!role) {
        this.error = 'Не удалось определить роль пользователя. Проверьте данные аккаунта.';
        this.tokenService.logout();
        this.loading = false;
        return;
      }
      
      // Проверяем, заполнен ли профиль
      this.api.checkProfileFilled(role).subscribe({
        next: (status) => {
          if (status.filled) {
            this.router.navigate([`/${role}-dashboard`]);
          } else {
            this.router.navigate(['/profile/edit']);
          }
        },
        error: () => {
          // Если ошибка — всё равно идём в дашборд
          this.router.navigate([`/${role}-dashboard`]);
        }
      });
      
      this.loading = false;
    },
    error: (err) => {
      console.error(err);
      this.error = 'Неверный логин или пароль';
      this.loading = false;
    }
  });
  }

}
