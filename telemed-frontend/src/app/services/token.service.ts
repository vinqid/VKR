import { Injectable } from '@angular/core';

type UserRole = 'medic' | 'patient';

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

  setUser(user: unknown, accessToken?: string): void {
    const normalizedRole = this.extractRole(user) ?? this.extractRoleFromToken(accessToken ?? this.getAccessToken());
    const normalizedUser = typeof user === 'object' && user !== null ? { ...(user as Record<string, unknown>) } : {};

    if (normalizedRole) {
      normalizedUser['role'] = normalizedRole;
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser));
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getUserRole(): UserRole | null {
    const userJson = localStorage.getItem('user');

    if (userJson) {
      try {
        const parsedUser = JSON.parse(userJson) as Record<string, unknown>;
        const role = this.extractRole(parsedUser);
        if (role) {
          return role;
        }
      } catch {
        localStorage.removeItem('user');
      }
    }

    return this.extractRoleFromToken(this.getAccessToken());
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
  }

  logout(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem('user');
  }

  private extractRole(user: unknown): UserRole | null {
    if (!user || typeof user !== 'object') {
      return null;
    }

    const role = (user as Record<string, unknown>)['role'];
    return role === 'medic' || role === 'patient' ? role : null;
  }

  private extractRoleFromToken(token: string | null): UserRole | null {
    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');
    if (tokenParts.length < 2) {
      return null;
    }

    try {
      const base64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
      const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
      const payload = JSON.parse(atob(paddedBase64)) as Record<string, unknown>;
      const role = payload['role'];

      return role === 'medic' || role === 'patient' ? role : null;
    } catch {
      return null;
    }
  }
}
