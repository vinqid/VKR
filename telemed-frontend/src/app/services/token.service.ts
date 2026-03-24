import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService  {
  private readonly ACCESS_TOKEN = 'access_token';
  private readonly REFRESH_TOKEN = 'refresh_token';

  setTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_TOKEN, access);
    localStorage.setItem(this.REFRESH_TOKEN, refresh);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
  }

  logout(): void {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
}
}
