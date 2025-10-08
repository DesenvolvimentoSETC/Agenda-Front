import { Injectable } from '@angular/core';
import {
  HttpRequest, 
  HttpHandler, 
  HttpEvent, 
  HttpInterceptor 
} from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { AuthService } from './auth.service'; 

@Injectable() 
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {} 

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Obtém o token JWT do AuthService
    const token = this.authService.getToken();

    // Clona a requisição e adiciona o cabeçalho Authorization se um token existir
    if (token && !request.url.includes('/auth/login')) {
      // Requisições são imutáveis em Angular, então precisamos cloná-las para modificá-las
      const authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // Define o cabeçalho Authorization com o token JWT
        }
      });
      // Envia a requisição modificada para o próximo manipulador na cadeia
      return next.handle(authRequest);
    }

    return next.handle(request);
  }
}