import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Не добавляем токен для запросов логина и регистрации
    const excludedUrls = ['/api/auth/login/', '/api/auth/register/'];
    const isExcluded = excludedUrls.some(url => req.url.includes(url));
    
    if (isExcluded) {
      return next.handle(req);
    }

    const token = this.tokenService.getAccessToken();
    
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    
    return next.handle(req);
  }
}